/**
 * COPILOT CONTROLLER
 * 
 * This is the core AI controller that handles user queries and generates
 * intelligent travel recommendations using the decision engine.
 * Enhanced with RAG, memory management, and real-time Socket.IO support
 */

import { asyncHandler } from '../middlewares/error.middleware.js';
import { buildContext, parseIntent, extractEntities, needsClarification } from '../utils/intentParser.util.js';
import { generateRecommendations, calculateEstimatedCost } from '../utils/recommendationEngine.util.js';
import { generateSafetyReport } from '../utils/safetyScore.util.js';
import { buildItinerary } from '../utils/itineraryBuilder.util.js';
import { formatCopilotResponse, formatClarificationRequest } from '../utils/responseFormatter.util.js';
import { Trip } from '../models/Trip.model.js';
import { compareDeals, validateDealSelection } from '../services/deal.service.js';
import { MemoryManager } from '../services/memory.service.js';
import { ragService } from '../services/rag.service.js';

/**
 * @desc    Process copilot query (Main AI endpoint with RAG & Memory)
 * @route   POST /api/copilot/query
 * @access  Private
 */
export const processQuery = asyncHandler(async (req, res) => {
  const { message, sessionId, context: additionalContext } = req.body;
  const user = req.user;
  
  // Initialize memory manager
  const memoryManager = new MemoryManager(user._id);
  await memoryManager.initializeSession(sessionId);
  
  // Add user message to memory
  memoryManager.addMessage('user', message);
  
  // STEP 1: Parse intent and extract entities
  const context = buildContext(message, user);
  
  console.log('🤖 Copilot Query:', message);
  console.log('📊 Parsed Context:', JSON.stringify(context, null, 2));
  
  // Update context in memory
  memoryManager.updateContext(context.query);
  
  // STEP 2: Check if clarification is needed
  const clarification = needsClarification(context);
  
  if (clarification.needsClarification) {
    const clarificationMsg = formatClarificationRequest(clarification.missingFields);
    memoryManager.addMessage('assistant', clarificationMsg);
    
    return res.status(200).json({
      success: true,
      needsClarification: true,
      response: clarificationMsg,
      sessionId: memoryManager.sessionId,
    });
  }
  
  // STEP 3: Use RAG to enhance response with relevant context
  let ragEnhancement = null;
  try {
    const history = memoryManager.getHistory();
    ragEnhancement = await ragService.generateResponse(message, history, {
      topK: 5,
      filter: {
        type: { $in: ['destination', 'policy', 'safety', 'tips'] },
      },
    });
  } catch (error) {
    console.warn('RAG enhancement failed:', error.message);
  }
  
  // STEP 4: Generate recommendations based on intent
  const intent = context.query.intent;
  let response;
  
  switch (intent) {
    case 'TRIP_PLANNING':
      response = await handleTripPlanning(context, user, ragEnhancement);
      break;
      
    case 'HOTEL_SEARCH':
      response = await handleHotelSearch(context, user, ragEnhancement);
      break;
      
    case 'FLIGHT_SEARCH':
      response = await handleFlightSearch(context, user, ragEnhancement);
      break;
      
    case 'ACTIVITY_SEARCH':
      response = await handleActivitySearch(context, user, ragEnhancement);
      break;
      
    case 'SAFETY_INQUIRY':
      response = await handleSafetyInquiry(context, user, ragEnhancement);
      break;
      
    case 'RECOMMENDATION':
      response = await handleRecommendation(context, user, ragEnhancement);
      break;
      
    default:
      response = await handleGeneralQuery(context, user, ragEnhancement);
  }
  
  // Add assistant response to memory
  const responseText = typeof response === 'string' ? response : response.message || 'Response generated';
  memoryManager.addMessage('assistant', responseText, {
    intent,
    confidence: context.query.confidence,
    ragSources: ragEnhancement?.sources?.map(s => s.id),
  });
  
  // Persist to long-term memory (async)
  memoryManager.persist(3).catch(err => 
    console.error('Error persisting memory:', err)
  );
  
  res.status(200).json({
    success: true,
    intent,
    confidence: context.query.confidence,
    response,
    sessionId: memoryManager.sessionId,
    ragSources: ragEnhancement?.sources,
  });
});

/**
 * Handle trip planning intent
 */
const handleTripPlanning = async (context, user, ragEnhancement) => {
  // Generate recommendations
  const recommendations = generateRecommendations(context);
  
  // Generate safety report
  const safety = generateSafetyReport(context.destination, context);
  
  // Build itinerary
  const itinerary = buildItinerary(context, recommendations);
  
  // Calculate cost estimate
  const costEstimate = calculateEstimatedCost(recommendations, context);
  
  // AGENT-SPECIFIC: If user is an agent, add deal comparison insights
  let dealComparison = null;
  let agentInsights = null;
  
  if (user?.role === 'AGENT') {
    try {
      dealComparison = await compareDeals({
        destination: context.destination,
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + (30 + context.duration) * 24 * 60 * 60 * 1000),
        budget: context.budget.amount || 50000,
        travelers: context.travel.count,
        preferences: user.preferences || {},
      });
      
      // Generate agent-specific insights
      agentInsights = {
        dealsAnalyzed: dealComparison.totalDealsAnalyzed,
        bestDealSavings: dealComparison.bestDeal.totalPrice < (context.budget.amount || 50000) 
          ? (context.budget.amount || 50000) - dealComparison.bestDeal.totalPrice 
          : 0,
        warnings: dealComparison.insights.filter(i => i.severity === 'warning'),
        opportunities: dealComparison.insights.filter(i => i.severity === 'good'),
        copilotRecommendation: generateAgentRecommendation(dealComparison),
      };
    } catch (error) {
      console.error('Error in agent deal comparison:', error);
    }
  }
  
  // Save trip to database (as planning)
  if (user) {
    try {
      const trip = await Trip.create({
        userId: user._id,
        agentId: user.role === 'AGENT' ? user._id : null,
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
        selectedDeal: dealComparison?.bestDeal || null,
        alternatives: dealComparison?.alternatives?.slice(0, 3) || [],
        insights: dealComparison?.insights || [],
      });
      
      context.tripId = trip._id;
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  }
  
  // Format response
  const baseResponse = formatCopilotResponse(context, recommendations, itinerary, safety);
  
  // Add agent-specific data to response
  if (agentInsights) {
    baseResponse.agentInsights = agentInsights;
    baseResponse.dealComparison = dealComparison;
  }
  
  return baseResponse;
};

/**
 * Generate agent-specific recommendation message
 */
const generateAgentRecommendation = (dealComparison) => {
  const bestDeal = dealComparison.bestDeal;
  const alternatives = dealComparison.alternatives;
  
  let message = `🎯 **Agent Recommendation**: `;
  
  // Check if best deal is optimal
  const hasBetterSafetyAlternative = alternatives.some(
    alt => alt.safetyScore > bestDeal.safetyScore && alt.totalPrice < bestDeal.totalPrice * 1.1
  );
  
  const hasCheaperAlternative = alternatives.some(
    alt => alt.totalPrice < bestDeal.totalPrice * 0.9 && alt.rating >= bestDeal.rating - 0.5
  );
  
  if (!hasBetterSafetyAlternative && !hasCheaperAlternative) {
    message += `The selected best deal offers excellent value. `;
    message += `Safety score: ${bestDeal.safetyScore}/10, Rating: ${bestDeal.rating}/5. `;
    message += `✅ No better alternatives found - proceed with confidence.`;
  } else if (hasCheaperAlternative) {
    const cheaperAlt = alternatives.find(
      alt => alt.totalPrice < bestDeal.totalPrice * 0.9 && alt.rating >= bestDeal.rating - 0.5
    );
    message += `⚠️ Found a cheaper alternative (${cheaperAlt.packageName}) `;
    message += `at ₹${cheaperAlt.totalPrice.toLocaleString()} with similar ratings. `;
    message += `Consider reviewing with client for potential savings.`;
  } else if (hasBetterSafetyAlternative) {
    message += `⚠️ A safer alternative exists with comparable pricing. `;
    message += `Review safety requirements with client before finalizing.`;
  }
  
  return message;
};

/**
 * Handle hotel search intent
 */
const handleHotelSearch = async (context, user, ragEnhancement) => {
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
const handleFlightSearch = async (context, user, ragEnhancement) => {
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
const handleActivitySearch = async (context, user, ragEnhancement) => {
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
const handleSafetyInquiry = async (context, user, ragEnhancement) => {
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
const handleRecommendation = async (context, user, ragEnhancement) => {
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
const handleGeneralQuery = async (context, user, ragEnhancement) => {
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
