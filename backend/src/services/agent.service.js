/**
 * AGENT SERVICE
 * 
 * Core business logic for agent operations:
 * - Client management
 * - Trip planning
 * - Deal comparison
 * - Itinerary generation
 */

import { User } from '../models/User.model.js';
import { Booking } from '../models/Booking.model.js';
import { Trip } from '../models/Trip.model.js';
import { compareDeals, validateDealSelection } from './deal.service.js';
import { buildItinerary } from '../utils/itineraryBuilder.util.js';

/**
 * Get all clients assigned to an agent
 */
export const getAgentClients = async (agentId) => {
  try {
    const agent = await User.findById(agentId).populate('agentDetails.clients', '-password');
    
    if (!agent || agent.role !== 'AGENT') {
      throw new Error('Agent not found');
    }

    const clients = agent.agentDetails?.clients || [];

    // Enrich with booking stats
    const enrichedClients = await Promise.all(
      clients.map(async (client) => {
        const bookings = await Booking.find({ userId: client._id });
        const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
        
        return {
          ...client.toObject(),
          stats: {
            totalBookings: bookings.length,
            activeBookings: activeBookings.length,
            totalSpent: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
          },
        };
      })
    );

    return {
      success: true,
      clients: enrichedClients,
      totalClients: enrichedClients.length,
    };
  } catch (error) {
    throw new Error(`Failed to fetch clients: ${error.message}`);
  }
};

/**
 * Add a client to agent's portfolio
 */
export const assignClientToAgent = async (agentId, clientEmail) => {
  try {
    const agent = await User.findById(agentId);
    const client = await User.findOne({ email: clientEmail, role: 'CLIENT' });

    if (!agent || agent.role !== 'AGENT') {
      throw new Error('Agent not found');
    }

    if (!client) {
      throw new Error('Client not found');
    }

    // Check if already assigned
    if (agent.agentDetails?.clients?.includes(client._id)) {
      return {
        success: false,
        message: 'Client already assigned to this agent',
      };
    }

    // Add client to agent
    if (!agent.agentDetails) {
      agent.agentDetails = { clients: [] };
    }
    agent.agentDetails.clients.push(client._id);
    await agent.save();

    return {
      success: true,
      message: 'Client assigned successfully',
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
      },
    };
  } catch (error) {
    throw new Error(`Failed to assign client: ${error.message}`);
  }
};

/**
 * Create trip plan for a client
 */
export const createTripPlan = async (agentId, planData) => {
  try {
    const { clientId, destination, startDate, endDate, budget, travelers, preferences } = planData;

    // Verify agent has access to client
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'AGENT') {
      throw new Error('Agent not found');
    }

    const hasAccess = agent.agentDetails?.clients?.some(c => c.toString() === clientId);
    if (!hasAccess) {
      throw new Error('Agent does not have access to this client');
    }

    // Get client details
    const client = await User.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    // Compare deals
    const dealComparison = await compareDeals({
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      preferences: preferences || client.preferences,
    });

    // Generate itinerary for best deal
    const itinerary = buildItinerary({
      destination: dealComparison.bestDeal.destination,
      startDate,
      endDate,
      travelStyle: client.preferences?.travelStyle || 'solo',
      activities: dealComparison.bestDeal.activities,
    });

    // Create trip record
    const trip = new Trip({
      userId: clientId,
      agentId,
      destination: dealComparison.bestDeal.destination,
      startDate,
      endDate,
      status: 'planned',
      travelers,
      preferences: preferences || client.preferences,
      selectedDeal: dealComparison.bestDeal,
      alternatives: dealComparison.alternatives.slice(0, 3),
      itinerary,
      pricing: {
        total: dealComparison.bestDeal.totalPrice,
        perPerson: dealComparison.bestDeal.pricePerPerson,
        breakdown: {
          accommodation: Math.round(dealComparison.bestDeal.totalPrice * 0.4),
          activities: Math.round(dealComparison.bestDeal.totalPrice * 0.3),
          meals: Math.round(dealComparison.bestDeal.totalPrice * 0.2),
          transport: Math.round(dealComparison.bestDeal.totalPrice * 0.1),
        },
      },
      insights: dealComparison.insights,
    });

    await trip.save();

    return {
      success: true,
      message: 'Trip plan created successfully',
      trip,
      dealComparison,
    };
  } catch (error) {
    throw new Error(`Failed to create trip plan: ${error.message}`);
  }
};

/**
 * Get all trip plans managed by agent
 */
export const getAgentTripPlans = async (agentId, filters = {}) => {
  try {
    const query = { agentId };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.clientId) {
      query.userId = filters.clientId;
    }

    const trips = await Trip.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return {
      success: true,
      trips,
      totalPlans: trips.length,
    };
  } catch (error) {
    throw new Error(`Failed to fetch trip plans: ${error.message}`);
  }
};

/**
 * Update trip plan
 */
export const updateTripPlan = async (agentId, tripId, updates) => {
  try {
    const trip = await Trip.findOne({ _id: tripId, agentId });

    if (!trip) {
      throw new Error('Trip plan not found or access denied');
    }

    // If changing selected deal, validate it
    if (updates.selectedDeal) {
      const validation = await validateDealSelection(updates.selectedDeal, {
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.pricing?.total || 50000,
        travelers: trip.travelers,
        preferences: trip.preferences,
      });

      updates.dealValidation = validation;
    }

    Object.assign(trip, updates);
    await trip.save();

    return {
      success: true,
      message: 'Trip plan updated successfully',
      trip,
    };
  } catch (error) {
    throw new Error(`Failed to update trip plan: ${error.message}`);
  }
};

/**
 * Compare multiple deals for agent dashboard
 */
export const compareDealsBulk = async (agentId, searchCriteria) => {
  try {
    const results = [];

    for (const criteria of searchCriteria) {
      const comparison = await compareDeals(criteria);
      results.push({
        criteria,
        comparison,
      });
    }

    return {
      success: true,
      results,
      totalComparisons: results.length,
    };
  } catch (error) {
    throw new Error(`Bulk comparison failed: ${error.message}`);
  }
};

/**
 * Get agent dashboard statistics
 */
export const getAgentDashboardStats = async (agentId) => {
  try {
    const agent = await User.findById(agentId).populate('agentDetails.clients');
    
    if (!agent || agent.role !== 'AGENT') {
      throw new Error('Agent not found');
    }

    const totalClients = agent.agentDetails?.clients?.length || 0;
    
    // Get bookings for all clients
    const clientIds = agent.agentDetails?.clients?.map(c => c._id) || [];
    const bookings = await Booking.find({ userId: { $in: clientIds } });
    
    const activeBookings = bookings.filter(b => 
      b.status === 'confirmed' || b.status === 'pending'
    );

    // Get trip plans
    const trips = await Trip.find({ agentId });
    const activePlans = trips.filter(t => 
      t.status === 'planned' || t.status === 'in-progress'
    );

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const potentialRevenue = activePlans.reduce((sum, t) => sum + (t.pricing?.total || 0), 0);

    return {
      success: true,
      stats: {
        totalClients,
        activeBookings: activeBookings.length,
        totalBookings: bookings.length,
        activePlans: activePlans.length,
        totalPlans: trips.length,
        totalRevenue,
        potentialRevenue,
        averageBookingValue: bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0,
      },
      recentActivity: {
        recentBookings: bookings.slice(0, 5),
        recentPlans: trips.slice(0, 5),
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
  }
};
