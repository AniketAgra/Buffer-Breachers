/**
 * PINECONE CONFIGURATION
 * 
 * Initialize and manage Pinecone vector database connection
 * for RAG (Retrieval-Augmented Generation) implementation
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { config } from './env.js';

let pineconeClient = null;
let pineconeIndex = null;

/**
 * Initialize Pinecone client
 */
export const initializePinecone = async () => {
  try {
    if (!config.pineconeApiKey) {
      console.warn('⚠️  Pinecone API key not configured. RAG features will be limited.');
      return null;
    }

    pineconeClient = new Pinecone({
      apiKey: config.pineconeApiKey,
    });

    // Get or create index
    const indexName = config.pineconeIndexName;
    
    // Check if index exists
    const indexList = await pineconeClient.listIndexes();
    const indexExists = indexList.indexes?.some(index => index.name === indexName);

    if (!indexExists) {
      console.log(`📦 Creating Pinecone index: ${indexName}...`);
      await pineconeClient.createIndex({
        name: indexName,
        dimension: 1536, // OpenAI embedding dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      console.log('✅ Pinecone index created successfully');
      
      // Wait for index to be ready
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    pineconeIndex = pineconeClient.index(indexName);
    console.log('✅ Pinecone initialized successfully');
    
    return pineconeIndex;
  } catch (error) {
    console.error('❌ Failed to initialize Pinecone:', error.message);
    return null;
  }
};

/**
 * Get Pinecone index instance
 */
export const getPineconeIndex = () => {
  if (!pineconeIndex) {
    throw new Error('Pinecone index not initialized. Call initializePinecone() first.');
  }
  return pineconeIndex;
};

/**
 * Get Pinecone client instance
 */
export const getPineconeClient = () => {
  return pineconeClient;
};
