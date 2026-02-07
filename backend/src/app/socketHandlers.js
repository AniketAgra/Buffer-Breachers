/**
 * SOCKET.IO HANDLERS
 * 
 * Real-time communication handlers for AI copilot
 * Handles streaming responses, typing indicators, and live updates
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/User.model.js';
import { MemoryManager } from '../services/memory.service.js';
import { ragService } from '../services/rag.service.js';
import { generateChatCompletion } from '../config/openai.js';
import { buildContext, needsClarification } from '../utils/intentParser.util.js';
import { formatCopilotResponse } from '../utils/responseFormatter.util.js';

/**
 * Socket authentication middleware
 */
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Invalid authentication token'));
  }
};

/**
 * Initialize Socket.IO handlers
 */
export const initializeSocketHandlers = (io) => {
  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.user.name} (${socket.id})`);

    // Initialize memory manager for this user
    const memoryManager = new MemoryManager(socket.user._id);

    // Join user-specific room
    socket.join(`user:${socket.user._id}`);

    /**
     * Initialize or resume conversation session
     */
    socket.on('session:init', async (data, callback) => {
      try {
        const { sessionId } = data;
        const newSessionId = await memoryManager.initializeSession(sessionId);
        
        callback({
          success: true,
          sessionId: newSessionId,
          history: memoryManager.getHistory(),
        });
      } catch (error) {
        console.error('Session init error:', error);
        callback({
          success: false,
          error: error.message,
        });
      }
    });

    /**
     * Handle copilot query with streaming response
     */
    socket.on('copilot:query', async (data) => {
      try {
        const { message, sessionId } = data;
        
        if (!sessionId) {
          socket.emit('copilot:error', { error: 'Session ID required' });
          return;
        }

        // Initialize session if needed
        await memoryManager.initializeSession(sessionId);

        // Add user message to memory
        memoryManager.addMessage('user', message);

        // Send typing indicator
        socket.emit('copilot:typing', { isTyping: true });

        // Build context
        const context = buildContext(message, socket.user);
        memoryManager.updateContext(context.query);

        // Check if clarification needed
        const clarification = needsClarification(context);
        if (clarification.needsClarification) {
          const clarificationMessage = `I need a bit more information. ${clarification.missingFields.join(', ')}?`;
          memoryManager.addMessage('assistant', clarificationMessage);
          
          socket.emit('copilot:response', {
            response: clarificationMessage,
            needsClarification: true,
            missingFields: clarification.missingFields,
          });
          
          socket.emit('copilot:typing', { isTyping: false });
          return;
        }

        // Get conversation history
        const history = memoryManager.getHistory();

        // Generate RAG-enhanced response
        const ragResponse = await ragService.generateResponse(
          message,
          history,
          {
            topK: 5,
            filter: {
              type: { $in: ['destination', 'policy', 'safety', 'tips'] },
            },
          }
        );

        // Add assistant response to memory
        memoryManager.addMessage('assistant', ragResponse.response, {
          sources: ragResponse.sources.map(s => s.id),
        });

        // Emit response
        socket.emit('copilot:response', {
          response: ragResponse.response,
          sources: ragResponse.sources,
          context: context.query,
        });

        // Stop typing indicator
        socket.emit('copilot:typing', { isTyping: false });

        // Persist to long-term memory (async)
        memoryManager.persist(3).catch(err => 
          console.error('Error persisting memory:', err)
        );

      } catch (error) {
        console.error('Copilot query error:', error);
        socket.emit('copilot:error', {
          error: 'Failed to process query',
          message: error.message,
        });
        socket.emit('copilot:typing', { isTyping: false });
      }
    });

    /**
     * Handle streaming query (for longer responses)
     */
    socket.on('copilot:stream', async (data) => {
      try {
        const { message, sessionId } = data;
        
        if (!sessionId) {
          socket.emit('copilot:error', { error: 'Session ID required' });
          return;
        }

        await memoryManager.initializeSession(sessionId);
        memoryManager.addMessage('user', message);

        socket.emit('copilot:typing', { isTyping: true });

        const context = buildContext(message, socket.user);
        const history = memoryManager.getHistory();

        // Get relevant context from RAG
        const relevantDocs = await ragService.retrieve(message, { topK: 5 });
        const ragContext = relevantDocs
          .map((doc, idx) => `[${idx + 1}] ${doc.content}`)
          .join('\n\n');

        // Build system prompt
        const systemPrompt = `You are an intelligent travel assistant. Use this context:\n\n${ragContext}\n\nBe helpful and conversational.`;

        // Simulate streaming (in production, use OpenAI streaming API)
        const fullResponse = await generateChatCompletion(
          [
            { role: 'system', content: systemPrompt },
            ...history.map(msg => ({ role: msg.role, content: msg.content })),
          ],
          { temperature: 0.7 }
        );

        // Emit response in chunks to simulate streaming
        const words = fullResponse.split(' ');
        let streamedResponse = '';
        
        for (let i = 0; i < words.length; i++) {
          streamedResponse += (i > 0 ? ' ' : '') + words[i];
          socket.emit('copilot:stream:chunk', {
            chunk: words[i] + ' ',
            complete: i === words.length - 1,
          });
          await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
        }

        memoryManager.addMessage('assistant', streamedResponse, {
          sources: relevantDocs.map(s => s.id),
        });

        socket.emit('copilot:stream:complete', {
          response: streamedResponse,
          sources: relevantDocs,
        });

        socket.emit('copilot:typing', { isTyping: false });

        memoryManager.persist(3).catch(err => 
          console.error('Error persisting memory:', err)
        );

      } catch (error) {
        console.error('Streaming error:', error);
        socket.emit('copilot:error', {
          error: 'Failed to stream response',
          message: error.message,
        });
        socket.emit('copilot:typing', { isTyping: false });
      }
    });

    /**
     * Get conversation history
     */
    socket.on('copilot:history', async (data, callback) => {
      try {
        const { sessionId } = data;
        await memoryManager.initializeSession(sessionId);
        
        callback({
          success: true,
          history: memoryManager.getHistory(),
          context: memoryManager.getContext(),
        });
      } catch (error) {
        console.error('History error:', error);
        callback({
          success: false,
          error: error.message,
        });
      }
    });

    /**
     * Clear session
     */
    socket.on('session:clear', async (data, callback) => {
      try {
        const { sessionId } = data;
        
        // Persist before clearing
        await memoryManager.persist(1);
        
        // Clear session
        await memoryManager.initializeSession(); // Creates new session
        
        callback({
          success: true,
          sessionId: memoryManager.sessionId,
        });
      } catch (error) {
        console.error('Clear session error:', error);
        callback({
          success: false,
          error: error.message,
        });
      }
    });

    /**
     * Get user preferences
     */
    socket.on('user:preferences', async (data, callback) => {
      try {
        const preferences = await memoryManager.getUserPreferences();
        
        callback({
          success: true,
          preferences,
        });
      } catch (error) {
        console.error('Preferences error:', error);
        callback({
          success: false,
          error: error.message,
        });
      }
    });

    /**
     * Feedback on response
     */
    socket.on('copilot:feedback', async (data) => {
      try {
        const { messageIndex, feedback, sessionId } = data;
        
        console.log(`Feedback received: ${feedback} for session ${sessionId}`);
        
        // Could store feedback for improving responses
        socket.emit('copilot:feedback:received', {
          success: true,
        });
      } catch (error) {
        console.error('Feedback error:', error);
      }
    });

    /**
     * Handle disconnection
     */
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.user.name} (${socket.id})`);
    });

    /**
     * Handle errors
     */
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('✅ Socket.IO handlers initialized');
};
