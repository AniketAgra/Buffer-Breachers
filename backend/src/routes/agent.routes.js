/**
 * AGENT ROUTES
 * 
 * Routes for agent-specific operations (protected by auth + requireAgent)
 */

import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAgent } from '../middlewares/role.middleware.js';
import {
  getDashboard,
  getClients,
  assignClient,
  compareDealsForTrip,
  validateDeal,
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from '../controllers/agent.controller.js';

const router = express.Router();

// Apply authentication and agent role check to all routes
router.use(authenticate);
router.use(requireAgent);

// Dashboard
router.get('/dashboard', getDashboard);

// Client management
router.get('/clients', getClients);
router.post('/clients', assignClient);

// Deal comparison and validation
router.post('/deals/compare', compareDealsForTrip);
router.post('/deals/validate', validateDeal);

// Trip planning
router.post('/trips', createTrip);
router.get('/trips', getTrips);
router.get('/trips/:tripId', getTripById);
router.put('/trips/:tripId', updateTrip);
router.delete('/trips/:tripId', deleteTrip);

export default router;
