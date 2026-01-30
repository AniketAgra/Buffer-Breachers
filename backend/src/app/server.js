import app from './app.js';
import { config } from '../config/env.js';
import { connectDB } from '../db/connectDB.js';

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    const PORT = config.port;
    
    app.listen(PORT, () => {
      console.log('═══════════════════════════════════════');
      console.log('🚀 TBO SMART TRAVEL COPILOT API');
      console.log('═══════════════════════════════════════');
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📡 API URL: http://localhost:${PORT}`);
      console.log(`🔗 CORS Origin: ${config.corsOrigin}`);
      console.log('═══════════════════════════════════════');
      console.log('📍 Available endpoints:');
      console.log('   POST   /api/auth/register');
      console.log('   POST   /api/auth/login');
      console.log('   POST   /api/copilot/query  🤖 (AI Copilot)');
      console.log('   GET    /api/travel/destinations');
      console.log('   POST   /api/travel/hotels/search');
      console.log('   GET    /api/safety/destination/:name');
      console.log('═══════════════════════════════════════');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

startServer();
