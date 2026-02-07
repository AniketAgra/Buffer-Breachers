/**
 * RAG SERVICE (Retrieval-Augmented Generation)
 * 
 * Implements RAG pattern using Pinecone vector database and OpenAI
 * - Store travel knowledge, policies, and destinations in vector DB
 * - Retrieve relevant context for user queries
 * - Augment AI responses with retrieved information
 */

import { getPineconeIndex } from '../config/pinecone.js';
import { generateEmbedding, generateChatCompletion } from '../config/openai.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * RAG Service Class
 */
export class RAGService {
  constructor() {
    this.namespace = 'travel-knowledge';
  }

  /**
   * Store document in vector database
   */
  async storeDocument(document) {
    try {
      const pineconeIndex = getPineconeIndex();
      
      // Generate embedding for the document
      const embedding = await generateEmbedding(document.content);

      // Create vector with metadata
      const vector = {
        id: document.id || uuidv4(),
        values: embedding,
        metadata: {
          content: document.content,
          type: document.type || 'knowledge',
          category: document.category || 'general',
          title: document.title || '',
          timestamp: new Date().toISOString(),
          ...document.metadata,
        },
      };

      // Upsert to Pinecone
      await pineconeIndex.namespace(this.namespace).upsert([vector]);

      return vector.id;
    } catch (error) {
      console.error('Error storing document in RAG:', error);
      throw error;
    }
  }

  /**
   * Store multiple documents in batch
   */
  async storeDocuments(documents) {
    try {
      const vectors = [];

      for (const doc of documents) {
        const embedding = await generateEmbedding(doc.content);
        vectors.push({
          id: doc.id || uuidv4(),
          values: embedding,
          metadata: {
            content: doc.content,
            type: doc.type || 'knowledge',
            category: doc.category || 'general',
            title: doc.title || '',
            timestamp: new Date().toISOString(),
            ...doc.metadata,
          },
        });
      }

      const pineconeIndex = getPineconeIndex();
      await pineconeIndex.namespace(this.namespace).upsert(vectors);

      return vectors.map(v => v.id);
    } catch (error) {
      console.error('Error storing documents in RAG:', error);
      throw error;
    }
  }

  /**
   * Retrieve relevant documents for a query
   */
  async retrieve(query, options = {}) {
    try {
      const {
        topK = 5,
        filter = {},
        includeMetadata = true,
      } = options;

      // Generate query embedding
      const queryEmbedding = await generateEmbedding(query);

      // Search in Pinecone
      const pineconeIndex = getPineconeIndex();
      const results = await pineconeIndex.namespace(this.namespace).query({
        vector: queryEmbedding,
        topK,
        includeMetadata,
        filter,
      });

      // Format results
      return results.matches.map(match => ({
        id: match.id,
        score: match.score,
        content: match.metadata?.content || '',
        metadata: match.metadata || {},
      }));
    } catch (error) {
      console.error('Error retrieving documents from RAG:', error);
      throw error;
    }
  }

  /**
   * Generate augmented response using RAG
   */
  async generateResponse(query, conversationHistory = [], options = {}) {
    try {
      // Step 1: Retrieve relevant context
      const relevantDocs = await this.retrieve(query, {
        topK: options.topK || 5,
        filter: options.filter,
      });

      // Step 2: Build context from retrieved documents
      const context = relevantDocs
        .map((doc, idx) => `[${idx + 1}] ${doc.content}`)
        .join('\n\n');

      // Step 3: Build messages for chat completion
      const systemPrompt = `You are an intelligent travel assistant copilot. Use the following context to answer the user's question accurately and helpfully.

CONTEXT:
${context}

INSTRUCTIONS:
- Use the provided context to give accurate, relevant answers
- If the context doesn't contain enough information, acknowledge this
- Be conversational and helpful
- Focus on travel recommendations, bookings, and safety information
- Consider the user's preferences and history`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user', content: query },
      ];

      // Step 4: Generate completion
      const response = await generateChatCompletion(messages, {
        model: options.model || 'gpt-4-turbo-preview',
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 1000,
      });

      return {
        response,
        sources: relevantDocs,
        context,
      };
    } catch (error) {
      console.error('Error generating RAG response:', error);
      throw error;
    }
  }

  /**
   * Delete document from vector database
   */
  async deleteDocument(documentId) {
    try {
      const pineconeIndex = getPineconeIndex();
      await pineconeIndex.namespace(this.namespace).deleteOne(documentId);
      return true;
    } catch (error) {
      console.error('Error deleting document from RAG:', error);
      throw error;
    }
  }

  /**
   * Update document in vector database
   */
  async updateDocument(documentId, document) {
    try {
      // Delete old version
      await this.deleteDocument(documentId);
      
      // Store new version with same ID
      return await this.storeDocument({
        ...document,
        id: documentId,
      });
    } catch (error) {
      console.error('Error updating document in RAG:', error);
      throw error;
    }
  }

  /**
   * Search documents by metadata
   */
  async searchByMetadata(filter, limit = 10) {
    try {
      const pineconeIndex = getPineconeIndex();
      
      // Create a dummy query vector for metadata filtering
      const dummyVector = new Array(1536).fill(0);
      
      const results = await pineconeIndex.namespace(this.namespace).query({
        vector: dummyVector,
        topK: limit,
        includeMetadata: true,
        filter,
      });

      return results.matches.map(match => ({
        id: match.id,
        content: match.metadata?.content || '',
        metadata: match.metadata || {},
      }));
    } catch (error) {
      console.error('Error searching by metadata:', error);
      throw error;
    }
  }
}

/**
 * Initialize default travel knowledge base
 */
export const initializeKnowledgeBase = async (ragService) => {
  try {
    const knowledgeDocuments = [
      {
        id: 'policy-budget',
        title: 'Corporate Travel Budget Policy',
        content: 'Corporate travel budget limits: Economy flights up to $1000, Business class flights up to $3000, Hotels up to $300/night, Meals up to $100/day. All bookings must be approved by travel coordinator.',
        type: 'policy',
        category: 'corporate',
      },
      {
        id: 'dest-london',
        title: 'London Travel Information',
        content: 'London is the capital of England and a major financial hub. Popular areas: City of London (financial district), Westminster (government), Camden (markets), Shoreditch (creative quarter). Best time to visit: May-September. Average hotel: £150-300/night. Public transport: Oyster card recommended.',
        type: 'destination',
        category: 'europe',
      },
      {
        id: 'dest-paris',
        title: 'Paris Travel Information',
        content: 'Paris is the capital of France, known for culture and cuisine. Key attractions: Eiffel Tower, Louvre, Notre-Dame, Champs-Élysées. Best time: April-June, September-October. Average hotel: €120-250/night. Metro system is efficient and covers entire city.',
        type: 'destination',
        category: 'europe',
      },
      {
        id: 'dest-tokyo',
        title: 'Tokyo Travel Information',
        content: 'Tokyo is Japan\'s bustling capital. Districts: Shibuya (shopping), Shinjuku (entertainment), Ginza (luxury), Asakusa (traditional). Best time: March-May, September-November. Average hotel: ¥15,000-30,000/night. JR Pass recommended for tourists.',
        type: 'destination',
        category: 'asia',
      },
      {
        id: 'dest-dubai',
        title: 'Dubai Travel Information',
        content: 'Dubai is a luxury destination in UAE. Attractions: Burj Khalifa, Dubai Mall, Palm Jumeirah, Desert Safari. Best time: November-March. Average hotel: $200-500/night. Dress code: Conservative in public areas.',
        type: 'destination',
        category: 'middle-east',
      },
      {
        id: 'safety-general',
        title: 'General Travel Safety Guidelines',
        content: 'Travel safety tips: Keep copies of important documents, register with embassy, have travel insurance, avoid displaying valuables, use hotel safe, be aware of surroundings, research local customs and laws, have emergency contacts saved.',
        type: 'safety',
        category: 'general',
      },
      {
        id: 'booking-tips',
        title: 'Booking Best Practices',
        content: 'Best booking practices: Book flights 3-8 weeks in advance for best prices, Tuesday and Wednesday typically cheapest, use incognito mode to avoid price tracking, compare multiple sites, check airline directly, consider nearby airports, flexible dates save money.',
        type: 'tips',
        category: 'booking',
      },
      {
        id: 'corp-process',
        title: 'Corporate Booking Process',
        content: 'Corporate booking workflow: 1) Get manager approval, 2) Check corporate travel policy, 3) Use preferred vendors, 4) Submit booking request, 5) Wait for travel coordinator approval, 6) Receive confirmation, 7) Keep all receipts for expense reporting.',
        type: 'process',
        category: 'corporate',
      },
    ];

    console.log('📚 Initializing knowledge base...');
    await ragService.storeDocuments(knowledgeDocuments);
    console.log('✅ Knowledge base initialized with', knowledgeDocuments.length, 'documents');
  } catch (error) {
    console.error('Error initializing knowledge base:', error);
  }
};

// Singleton instance
export const ragService = new RAGService();
