import express from 'express';
import {
  getDestinationSafety,
  getActiveAlerts,
  reportSafetyConcern,
  getAreaSafety,
  getDemographicSafety,
} from '../controllers/safety.controller.js';
import { authenticate, optionalAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/destination/:name', getDestinationSafety);
router.get('/alerts/:destination', getActiveAlerts);
router.get('/areas/:destination', getAreaSafety);
router.get('/demographic/:destination/:demographic', getDemographicSafety);

// Protected routes
router.post('/report', authenticate, reportSafetyConcern);

export default router;
