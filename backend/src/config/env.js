import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tbo-travel-copilot',
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // AI & RAG Configuration
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  pineconeApiKey: process.env.PINECONE_API_KEY || '',
  pineconeEnvironment: process.env.PINECONE_ENVIRONMENT || 'gcp-starter',
  pineconeIndexName: process.env.PINECONE_INDEX_NAME || 'travel-copilot',
  
  // Memory Configuration
  shortTermMemoryLimit: parseInt(process.env.SHORT_TERM_MEMORY_LIMIT || '10'),
  longTermMemoryThreshold: parseInt(process.env.LONG_TERM_MEMORY_THRESHOLD || '5'),
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];

if (config.nodeEnv === 'production') {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.error(`❌ Error: ${envVar} is not defined in environment variables`);
      process.exit(1);
    }
  });
}
