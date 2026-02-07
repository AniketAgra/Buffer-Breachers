/**
 * MEMORY SERVICE
 * 
 * Manages short-term and long-term memory for AI copilot conversations
 * - Short-term: Recent conversation context (session-based)
 * - Long-term: Historical patterns and user preferences (persistent)
 */

import { Conversation } from '../models/Conversation.model.js';
import { config } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * SHORT-TERM MEMORY (Session-based)
 * Stores recent conversation in memory for quick access
 */
class ShortTermMemory {
  constructor() {
    this.sessions = new Map(); // sessionId -> { messages[], context, lastAccess }
    this.maxMessages = config.shortTermMemoryLimit;
  }

  /**
   * Add message to short-term memory
   */
  addMessage(sessionId, role, content, metadata = {}) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        messages: [],
        context: {},
        lastAccess: Date.now(),
      });
    }

    const session = this.sessions.get(sessionId);
    session.messages.push({
      role,
      content,
      timestamp: new Date(),
      metadata,
    });

    // Keep only last N messages
    if (session.messages.length > this.maxMessages) {
      session.messages = session.messages.slice(-this.maxMessages);
    }

    session.lastAccess = Date.now();
    return session;
  }

  /**
   * Get conversation history for a session
   */
  getHistory(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return [];
    }
    session.lastAccess = Date.now();
    return session.messages;
  }

  /**
   * Update session context
   */
  updateContext(sessionId, context) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        messages: [],
        context: {},
        lastAccess: Date.now(),
      });
    }
    const session = this.sessions.get(sessionId);
    session.context = { ...session.context, ...context };
    session.lastAccess = Date.now();
  }

  /**
   * Get session context
   */
  getContext(sessionId) {
    const session = this.sessions.get(sessionId);
    return session ? session.context : {};
  }

  /**
   * Clear old sessions (cleanup)
   */
  cleanup(maxAge = 3600000) { // Default: 1 hour
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastAccess > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * Clear specific session
   */
  clearSession(sessionId) {
    this.sessions.delete(sessionId);
  }
}

/**
 * LONG-TERM MEMORY (Database-backed)
 * Stores important conversations and patterns in MongoDB
 */
class LongTermMemory {
  /**
   * Save conversation to long-term memory
   */
  async saveConversation(userId, sessionId, messages, context = {}, importance = 1) {
    try {
      const conversation = await Conversation.findOneAndUpdate(
        { userId, sessionId },
        {
          $set: {
            messages,
            context,
            importance,
            lastAccessedAt: new Date(),
          },
          $setOnInsert: {
            isActive: true,
          },
        },
        { upsert: true, new: true }
      );

      return conversation;
    } catch (error) {
      console.error('Error saving conversation to long-term memory:', error);
      throw error;
    }
  }

  /**
   * Get conversation history from long-term memory
   */
  async getConversation(userId, sessionId) {
    try {
      const conversation = await Conversation.findOne({ userId, sessionId });
      
      if (conversation) {
        conversation.lastAccessedAt = new Date();
        await conversation.save();
      }

      return conversation;
    } catch (error) {
      console.error('Error retrieving conversation from long-term memory:', error);
      throw error;
    }
  }

  /**
   * Get user's recent conversations
   */
  async getRecentConversations(userId, limit = 10) {
    try {
      const conversations = await Conversation.find({
        userId,
        isActive: true,
      })
        .sort({ lastAccessedAt: -1 })
        .limit(limit)
        .select('sessionId messages context importance lastAccessedAt');

      return conversations;
    } catch (error) {
      console.error('Error retrieving recent conversations:', error);
      throw error;
    }
  }

  /**
   * Search conversations by content or context
   */
  async searchConversations(userId, query, limit = 5) {
    try {
      const conversations = await Conversation.find({
        userId,
        isActive: true,
        $or: [
          { 'messages.content': { $regex: query, $options: 'i' } },
          { summary: { $regex: query, $options: 'i' } },
        ],
      })
        .sort({ importance: -1, lastAccessedAt: -1 })
        .limit(limit);

      return conversations;
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw error;
    }
  }

  /**
   * Get user preferences and patterns from historical data
   */
  async getUserPreferences(userId) {
    try {
      const conversations = await Conversation.find({
        userId,
        isActive: true,
      })
        .sort({ importance: -1 })
        .limit(50);

      // Extract patterns from conversations
      const preferences = this._extractPreferences(conversations);
      return preferences;
    } catch (error) {
      console.error('Error extracting user preferences:', error);
      return {};
    }
  }

  /**
   * Extract user preferences from conversations
   * @private
   */
  _extractPreferences(conversations) {
    const preferences = {
      destinations: {},
      budgetRange: {},
      travelStyle: {},
      accommodationPreferences: {},
    };

    conversations.forEach(conv => {
      const context = conv.context || {};
      
      // Track destinations
      if (context.destination) {
        preferences.destinations[context.destination] = 
          (preferences.destinations[context.destination] || 0) + 1;
      }

      // Track budget
      if (context.budget) {
        const range = this._getBudgetRange(context.budget);
        preferences.budgetRange[range] = 
          (preferences.budgetRange[range] || 0) + 1;
      }

      // Track travel style
      if (context.travelType) {
        preferences.travelStyle[context.travelType] = 
          (preferences.travelStyle[context.travelType] || 0) + 1;
      }
    });

    return preferences;
  }

  /**
   * Categorize budget into ranges
   * @private
   */
  _getBudgetRange(budget) {
    if (budget < 1000) return 'budget';
    if (budget < 3000) return 'moderate';
    if (budget < 5000) return 'premium';
    return 'luxury';
  }

  /**
   * Archive old conversations
   */
  async archiveOldConversations(userId, daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Conversation.updateMany(
        {
          userId,
          lastAccessedAt: { $lt: cutoffDate },
          isActive: true,
        },
        {
          $set: { isActive: false },
        }
      );

      return result;
    } catch (error) {
      console.error('Error archiving conversations:', error);
      throw error;
    }
  }
}

// Singleton instances
const shortTermMemory = new ShortTermMemory();
const longTermMemory = new LongTermMemory();

// Cleanup short-term memory every 30 minutes
setInterval(() => {
  shortTermMemory.cleanup();
}, 1800000);

export {
  shortTermMemory,
  longTermMemory,
  ShortTermMemory,
  LongTermMemory,
};

/**
 * UNIFIED MEMORY MANAGER
 * Coordinates between short-term and long-term memory
 */
export class MemoryManager {
  constructor(userId) {
    this.userId = userId;
    this.sessionId = null;
  }

  /**
   * Initialize or resume session
   */
  async initializeSession(sessionId = null) {
    this.sessionId = sessionId || uuidv4();

    // Try to load from long-term memory if resuming
    if (sessionId) {
      const conversation = await longTermMemory.getConversation(this.userId, sessionId);
      if (conversation && conversation.messages) {
        // Restore to short-term memory
        conversation.messages.forEach(msg => {
          shortTermMemory.addMessage(
            this.sessionId,
            msg.role,
            msg.content,
            msg.metadata || {}
          );
        });
        
        if (conversation.context) {
          shortTermMemory.updateContext(this.sessionId, conversation.context);
        }
      }
    }

    return this.sessionId;
  }

  /**
   * Add message to memory
   */
  addMessage(role, content, metadata = {}) {
    shortTermMemory.addMessage(this.sessionId, role, content, metadata);
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return shortTermMemory.getHistory(this.sessionId);
  }

  /**
   * Update context
   */
  updateContext(context) {
    shortTermMemory.updateContext(this.sessionId, context);
  }

  /**
   * Get context
   */
  getContext() {
    return shortTermMemory.getContext(this.sessionId);
  }

  /**
   * Save to long-term memory
   */
  async persist(importance = 1) {
    const messages = this.getHistory();
    const context = this.getContext();
    
    await longTermMemory.saveConversation(
      this.userId,
      this.sessionId,
      messages,
      context,
      importance
    );
  }

  /**
   * Get relevant historical context
   */
  async getRelevantHistory(query, limit = 5) {
    const conversations = await longTermMemory.searchConversations(
      this.userId,
      query,
      limit
    );
    return conversations;
  }

  /**
   * Get user preferences
   */
  async getUserPreferences() {
    return await longTermMemory.getUserPreferences(this.userId);
  }
}
