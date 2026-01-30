/**
 * COPILOT CONTROLLER
 * 
 * This is the core AI controller that handles user queries and generates
 * intelligent travel recommendations using the decision engine.
 */

import { asyncHandler } from '../middlewares/error.middleware.js';
import { buildContext, parseIntent, extractEntities, needsClarification } from '../utils/intentParser.util.js';
import { generateRecommendations, calculateEstimatedCost } from '../utils/recommendationEngine.util.js';
import { generateSafetyReport } from '../utils/safetyScore.util.js';
import { buildItinerary } from '../utils/itineraryBuilder.util.js';
import { formatCopilotResponse, formatClarificationRequest } from '../utils/responseFormatter.util.js';
import { Trip } from '../models/Trip.model.js';

/**
 * @desc    Process copilot query (Main AI endpoint)
 * @route   POST /api/copilot/query
 * @access  Private
 */
export const processQuery = asyncHandler(async (req, res) => {
  const { message, sessionId, context: additionalContext } = req.body;
  const user = req.user;
  
  // STEP 1: Parse intent and extract entities
  const context = buildContext(message, user);
  
  console.log('🤖 Copilot Query:', message);
  console.log('📊 Parsed Context:', JSON.stringify(context, null, 2));
  
  // STEP 2: Check if clarification is needed
  const clarification = needsClarification(context);
  
  if (clarification.needsClarification) {
    return res.status(200).json({
      success: true,
      needsClarification: true,
      response: formatClarificationRequest(clarification.missingFields),
    });
  }
  
  // STEP 3: Generate recommendations based on intent
  const intent = context.query.intent;
  let response;
  
  switch (intent) {
    case 'TRIP_PLANNING':
      response = await handleTripPlanning(context, user);
      break;
      
    case 'HOTEL_SEARCH':
      response = await handleHotelSearch(context, user);
      break;
      
    case 'FLIGHT_SEARCH':
      response = await handleFlightSearch(context, user);
      break;
      
    case 'ACTIVITY_SEARCH':
      response = await handleActivitySearch(context, user);
      break;
      
    case 'SAFETY_INQUIRY':
      response = await handleSafetyInquiry(context, user);
      break;
      
    case 'RECOMMENDATION':
      response = await handleRecommendation(context, user);
      break;
      
    default:
      response = await handleGeneralQuery(context, user);
  }
  
  res.status(200).json({
    success: true,
    intent,
    confidence: context.query.confidence,
    response,
  });
});

/**
 * Handle trip planning intent
 */
const handleTripPlanning = async (context, user) => {
  // Generate recommendations
  const recommendations = generateRecommendations(context);
  
  // Generate safety report
  const safety = generateSafetyReport(context.destination, context);
  
  // Build itinerary
  const itinerary = buildItinerary(context, recommendations);
  
  // Calculate cost estimate
  const costEstimate = calculateEstimatedCost(recommendations, context);
  
  // Save trip to database (as planning)
  if (user) {
    try {
      const trip = await Trip.create({
        userId: user._id,
        destination: context.destination,
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days from now
        endDate: new Date(Date.now() + (30 + context.duration) * 24 * 60 * 60 * 1000),
        duration: context.duration,
        budget: context.budget.amount || 50000,
        travelType: context.travel.type,
        numberOfTravelers: context.travel.count,
        status: 'planning',
        itinerary: itinerary?.days || [],
        totalCost: costEstimate.total,
        costBreakdown: costEstimate.breakdown,
      });
      
      context.tripId = trip._id;
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  }
  
  // Format response
  return formatCopilotResponse(context, recommendations, itinerary, safety);
};

/**
 * Handle hotel search intent
 */
const handleHotelSearch = async (context, user) => {
  const recommendations = generateRecommendations(context);
  
  return {
    conversationalResponse: `I found ${recommendations.hotels.length} hotels in ${context.destination} that match your preferences.`,
    hotels: recommendations.hotels,
    metadata: {
      destination: context.destination,
      budget: context.budget,
    },
  };
};

/**
 * Handle flight search intent
 */
const handleFlightSearch = async (context, user) => {
  const recommendations = generateRecommendations(context);
  
  return {
    conversationalResponse: `Here are the best flight options to ${context.destination}.`,
    flights: recommendations.flights,
    metadata: {
      destination: context.destination,
      travelType: context.travel.type,
    },
  };
};

/**
 * Handle activity search intent
 */
const handleActivitySearch = async (context, user) => {
  const recommendations = generateRecommendations(context);
  
  return {
    conversationalResponse: `I found ${recommendations.activities.length} exciting activities in ${context.destination}.`,
    activities: recommendations.activities,
    metadata: {
      destination: context.destination,
      preferences: context.preferences,
    },
  };
};

/**
 * Handle safety inquiry intent
 */
const handleSafetyInquiry = async (context, user) => {
  const safety = generateSafetyReport(context.destination, context);
  
  return {
    conversationalResponse: `Safety information for ${context.destination}: Overall safety score is ${safety.overallSafety.overallScore}/10.`,
    safety,
    metadata: {
      destination: context.destination,
      travelType: context.travel.type,
    },
  };
};

/**
 * Handle general recommendation intent
 */
const handleRecommendation = async (context, user) => {
  const recommendations = generateRecommendations(context);
  const safety = generateSafetyReport(context.destination, context);
  
  return {
    conversationalResponse: `Based on your preferences, here are my top recommendations for ${context.destination}.`,
    recommendations,
    safety,
  };
};

/**
 * Handle general queries
 */
const handleGeneralQuery = async (context, user) => {
  return {
    conversationalResponse: `I can help you plan your trip! Please provide more details about your destination, budget, and duration.`,
    suggestions: [
      'Plan a 5-day trip to Dubai',
      'Show me hotels in Goa under 10k per night',
      'Is Singapore safe for solo travelers?',
      'What activities are there in Bangkok?',
    ],
  };
};

/**
 * @desc    Get conversation history
 * @route   GET /api/copilot/history
 * @access  Private
 */
export const getConversationHistory = asyncHandler(async (req, res) => {
  // In a real app, you'd store conversation history in database
  // For now, return empty array
  res.status(200).json({
    success: true,
    data: {
      conversations: [],
    },
  });
});

/**
 * @desc    Submit feedback on copilot response
 * @route   POST /api/copilot/feedback
 * @access  Private
 */
export const submitFeedback = asyncHandler(async (req, res) => {
  const { responseId, rating, comment } = req.body;
  
  // In a real app, store feedback in database
  console.log('Feedback received:', { responseId, rating, comment });
  
  res.status(200).json({
    success: true,
    message: 'Thank you for your feedback!',
  });
});
