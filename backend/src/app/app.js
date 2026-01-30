import express from 'express';
import cors from 'cors';
import { config } from '../config/env.js';
import { errorHandler, notFound } from '../middlewares/error.middleware.js';

// Import routes
import authRoutes from '../routes/auth.routes.js';
import copilotRoutes from '../routes/copilot.routes.js';
import travelRoutes from '../routes/travel.routes.js';
import safetyRoutes from '../routes/safety.routes.js';
import bookingRoutes from '../routes/booking.routes.js';
import reviewRoutes from '../routes/review.routes.js';

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TBO Smart Travel Copilot API',
    version: '1.0.0',
    status: 'running',
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/review', reviewRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
