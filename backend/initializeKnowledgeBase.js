/**
 * Initialize Knowledge Base Script
 * 
 * Run this script once to populate the Pinecone vector database
 * with initial travel knowledge, policies, and information.
 * 
 * Usage: node initializeKnowledgeBase.js
 */

import { initializePinecone } from './src/config/pinecone.js';
import { initializeOpenAI } from './src/config/openai.js';
import { ragService, initializeKnowledgeBase } from './src/services/rag.service.js';

async function main() {
  console.log('🚀 Starting Knowledge Base Initialization...\n');

  try {
    // Step 1: Initialize Pinecone
    console.log('📦 Initializing Pinecone...');
    const pineconeIndex = await initializePinecone();
    
    if (!pineconeIndex) {
      console.error('❌ Failed to initialize Pinecone. Check your API key.');
      process.exit(1);
    }

    // Step 2: Initialize OpenAI
    console.log('🤖 Initializing OpenAI...');
    const openai = initializeOpenAI();
    
    if (!openai) {
      console.error('❌ Failed to initialize OpenAI. Check your API key.');
      process.exit(1);
    }

    // Wait a moment for Pinecone index to be ready
    console.log('⏳ Waiting for Pinecone index to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 3: Initialize Knowledge Base
    console.log('\n📚 Populating knowledge base...');
    await initializeKnowledgeBase(ragService);

    console.log('\n✅ Knowledge Base Initialization Complete!');
    console.log('\n📊 Summary:');
    console.log('   - Vector database: Pinecone ✓');
    console.log('   - Embeddings: OpenAI text-embedding-ada-002 ✓');
    console.log('   - Knowledge documents: 8+ documents loaded ✓');
    console.log('\n🎉 Your AI Copilot is ready to use!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during initialization:', error.message);
    console.error('\nPlease check:');
    console.error('1. PINECONE_API_KEY is set in .env');
    console.error('2. OPENAI_API_KEY is set in .env');
    console.error('3. Internet connection is stable');
    console.error('4. API keys are valid and have proper permissions\n');
    process.exit(1);
  }
}

main();
