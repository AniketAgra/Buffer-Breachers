/**
 * AGENT CONTROLLER
 * 
 * Handles HTTP requests for agent operations
 */

import {
  getAgentClients,
  assignClientToAgent,
  createTripPlan,
  getAgentTripPlans,
  updateTripPlan,
  getAgentDashboardStats,
} from '../services/agent.service.js';
import { compareDeals, validateDealSelection } from '../services/deal.service.js';

/**
 * Get agent dashboard statistics
 * GET /api/agent/dashboard
 */
export const getDashboard = async (req, res, next) => {
  try {
    const agentId = req.userId;
    const stats = await getAgentDashboardStats(agentId);
    
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all clients assigned to agent
 * GET /api/agent/clients
 */
export const getClients = async (req, res, next) => {
  try {
    const agentId = req.userId;
    const result = await getAgentClients(agentId);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Assign a client to agent
 * POST /api/agent/clients
 */
export const assignClient = async (req, res, next) => {
  try {
    const agentId = req.userId;
    const { clientEmail } = req.body;
    
    if (!clientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Client email is required',
      });
    }
    
    const result = await assignClientToAgent(agentId, clientEmail);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Compare deals for trip planning
 * POST /api/agent/deals/compare
 */
export const compareDealsForTrip = async (req, res, next) => {
  try {
    const { destination, startDate, endDate, budget, travelers, preferences } = req.body;
    
    if (!destination || !startDate || !endDate || !budget || !travelers) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: destination, startDate, endDate, budget, travelers',
      });
    }
    
    const result = await compareDeals({
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      preferences,
    });
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Validate a selected deal
 * POST /api/agent/deals/validate
 */
export const validateDeal = async (req, res, next) => {
  try {
    const { selectedDeal, criteria } = req.body;
    
    if (!selectedDeal || !criteria) {
      return res.status(400).json({
        success: false,
        message: 'Selected deal and criteria are required',
      });
    }
    
    const result = await validateDealSelection(selectedDeal, criteria);
    res.status(200).json({
      success: true,
      validation: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create trip plan for a client
 * POST /api/agent/trips
 */
export const createTrip = async (req, res, next) => {
  try {
    const agentId = req.userId;
    const planData = req.body;
    
    if (!planData.clientId || !planData.destination || !planData.startDate || !planData.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }
    
    const result = await createTripPlan(agentId, planData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all trip plans managed by agent
 * GET /api/agent/trips
 */
export const getTrips = async (req, res, next) => {
  try {
    const agentId = req.userId;
    const { status, clientId } = req.query;
    
    const result = await getAgentTripPlans(agentId, { status, clientId });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get specific trip plan
 * GET /api/agent/trips/:tripId
 */
export const getTripById = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const agentId = req.userId;
    
    const Trip = (await import('../models/Trip.model.js')).Trip;
    const trip = await Trip.findOne({ _id: tripId, agentId })
      .populate('userId', 'name email preferences');
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or access denied',
      });
    }
    
    res.status(200).json({
      success: true,
      trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update trip plan
 * PUT /api/agent/trips/:tripId
 */
export const updateTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const agentId = req.userId;
    const updates = req.body;
    
    const result = await updateTripPlan(agentId, tripId, updates);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete trip plan
 * DELETE /api/agent/trips/:tripId
 */
export const deleteTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const agentId = req.userId;
    
    const Trip = (await import('../models/Trip.model.js')).Trip;
    const trip = await Trip.findOneAndDelete({ _id: tripId, agentId });
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or access denied',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Trip plan deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
