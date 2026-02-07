/**
 * OPENAI CONFIGURATION
 * 
 * Initialize and manage OpenAI API client for embeddings and completions
 */

import OpenAI from 'openai';
import { config } from './env.js';

let openaiClient = null;

/**
 * Initialize OpenAI client
 */
export const initializeOpenAI = () => {
  try {
    if (!config.openaiApiKey) {
      console.warn('⚠️  OpenAI API key not configured. AI features will be limited.');
      return null;
    }

    openaiClient = new OpenAI({
      apiKey: config.openaiApiKey,
    });

    console.log('✅ OpenAI initialized successfully');
    return openaiClient;
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI:', error.message);
    return null;
  }
};

/**
 * Get OpenAI client instance
 */
export const getOpenAIClient = () => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI() first.');
  }
  return openaiClient;
};

/**
 * Generate embeddings for text using OpenAI
 */
export const generateEmbedding = async (text) => {
  try {
    if (!openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await openaiClient.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('❌ Error generating embedding:', error.message);
    throw error;
  }
};

/**
 * Generate chat completion using OpenAI
 */
export const generateChatCompletion = async (messages, options = {}) => {
  try {
    if (!openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await openaiClient.chat.completions.create({
      model: options.model || 'gpt-4-turbo-preview',
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
      ...options,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('❌ Error generating chat completion:', error.message);
    throw error;
  }
};
