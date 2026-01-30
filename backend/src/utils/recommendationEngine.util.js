/**
 * RECOMMENDATION ENGINE UTILITY
 * 
 * This module implements the core AI logic for recommending hotels, flights, and activities.
 * Uses weighted scoring algorithms, filtering, and ranking (NO ML).
 * 
 * Scoring Factors:
 * - Price-to-budget ratio
 * - User ratings
 * - Location proximity
 * - Preference matching
 * - Availability
 */

import { hotels, flights, activities, destinations } from './mockData.util.js';

// ============================================
// HOTEL RECOMMENDATION ENGINE
// ============================================

/**
 * Score hotel based on context
 * @param {Object} hotel - Hotel object
 * @param {Object} context - User context
 * @returns {number} - Score (0-100)
 */
const scoreHotel = (hotel, context) => {
  let score = 0;
  
  // 1. PRICE SCORING (Weight: 35%)
  const budget = context.budget.amount || getDefaultBudget(context.budget.preference);
  const dailyBudget = budget / (context.duration || 3); // Estimate daily budget
  const hotelBudgetAllocation = dailyBudget * 0.4; // 40% of daily budget for hotel
  
  if (hotel.price <= hotelBudgetAllocation * 0.8) {
    score += 35; // Well under budget
  } else if (hotel.price <= hotelBudgetAllocation) {
    score += 28; // Within budget
  } else if (hotel.price <= hotelBudgetAllocation * 1.2) {
    score += 18; // Slightly over budget
  } else {
    score += 5; // Too expensive
  }
  
  // 2. RATING SCORING (Weight: 25%)
  const ratingScore = (hotel.reviewScore / 10) * 25;
  score += ratingScore;
  
  // 3. LOCATION SCORING (Weight: 20%)
  if (hotel.distanceFromCenter <= 3) {
    score += 20; // Central location
  } else if (hotel.distanceFromCenter <= 7) {
    score += 15; // Reasonable distance
  } else if (hotel.distanceFromCenter <= 12) {
    score += 10; // Farther out
  } else {
    score += 5; // Very far
  }
  
  // 4. CATEGORY MATCH (Weight: 10%)
  const budgetToCategory = {
    budget: ['budget'],
    'mid-range': ['budget', 'mid-range'],
    luxury: ['mid-range', 'luxury'],
  };
  
  if (budgetToCategory[context.budget.preference]?.includes(hotel.category)) {
    score += 10;
  }
  
  // 5. PREFERENCE MATCH (Weight: 10%)
  if (context.travel.type === 'family' && hotel.familyFriendly) {
    score += 5;
  }
  
  if (context.preferences.accommodation === 'resort' && hotel.rating >= 4) {
    score += 3;
  }
  
  if (context.preferences.accommodation === 'hotel' && hotel.rating === 3) {
    score += 3;
  }
  
  // 6. AMENITIES BONUS (Weight: bonus points)
  const preferredAmenities = ['Pool', 'Spa', 'Beach', 'Restaurant', 'Gym'];
  const matchedAmenities = hotel.amenities.filter(a => preferredAmenities.includes(a));
  score += matchedAmenities.length * 0.5;
  
  return Math.min(score, 100); // Cap at 100
};

/**
 * Get default budget based on preference
 */
const getDefaultBudget = (preference) => {
  const defaults = {
    budget: 30000,
    'mid-range': 70000,
    luxury: 150000,
  };
  return defaults[preference] || 50000;
};

/**
 * Recommend hotels
 * @param {Object} context - User context
 * @param {number} limit - Number of recommendations
 * @returns {Array} - Recommended hotels with scores
 */
export const recommendHotels = (context, limit = 5) => {
  if (!context.destination) {
    return [];
  }
  
  // Filter by destination
  let filteredHotels = hotels.filter(
    h => h.destination.toLowerCase() === context.destination.toLowerCase()
  );
  
  if (filteredHotels.length === 0) {
    // Try by destinationId
    const destObj = destinations.find(
      d => d.name.toLowerCase() === context.destination.toLowerCase()
    );
    if (destObj) {
      filteredHotels = hotels.filter(h => h.destinationId === destObj.id);
    }
  }
  
  // Score each hotel
  const scoredHotels = filteredHotels.map(hotel => ({
    ...hotel,
    score: scoreHotel(hotel, context),
    matchReason: generateHotelMatchReason(hotel, context),
  }));
  
  // Sort by score (descending)
  scoredHotels.sort((a, b) => b.score - a.score);
  
  // Return top N
  return scoredHotels.slice(0, limit);
};

/**
 * Generate match reason explanation
 */
const generateHotelMatchReason = (hotel, context) => {
  const reasons = [];
  
  if (hotel.reviewScore >= 9.0) {
    reasons.push('Highly rated by guests');
  }
  
  if (hotel.distanceFromCenter <= 3) {
    reasons.push('Central location');
  }
  
  if (context.travel.type === 'family' && hotel.familyFriendly) {
    reasons.push('Family-friendly amenities');
  }
  
  if (hotel.category === context.budget.preference) {
    reasons.push('Matches your budget preference');
  }
  
  if (hotel.amenities.includes('Pool') || hotel.amenities.includes('Spa')) {
    reasons.push('Excellent facilities');
  }
  
  return reasons.join(', ');
};

// ============================================
// FLIGHT RECOMMENDATION ENGINE
// ============================================

/**
 * Score flight based on context
 */
const scoreFlight = (flight, context) => {
  let score = 0;
  
  // 1. PRICE SCORING (Weight: 40%)
  const budget = context.budget.amount || getDefaultBudget(context.budget.preference);
  const flightBudget = budget * 0.3; // 30% of total budget for flights
  
  if (flight.price <= flightBudget * 0.7) {
    score += 40;
  } else if (flight.price <= flightBudget) {
    score += 32;
  } else if (flight.price <= flightBudget * 1.3) {
    score += 20;
  } else {
    score += 8;
  }
  
  // 2. DIRECT FLIGHT BONUS (Weight: 25%)
  if (flight.stops === 0) {
    score += 25;
  } else if (flight.stops === 1) {
    score += 12;
  } else {
    score += 5;
  }
  
  // 3. DURATION SCORING (Weight: 15%)
  const durationHours = parseDuration(flight.duration);
  if (durationHours <= 3) {
    score += 15;
  } else if (durationHours <= 6) {
    score += 12;
  } else if (durationHours <= 10) {
    score += 8;
  } else {
    score += 4;
  }
  
  // 4. TIME OF DAY PREFERENCE (Weight: 10%)
  const hour = parseInt(flight.departure.split(':')[0]);
  
  if (context.travel.type === 'family') {
    // Families prefer morning/afternoon flights
    if (hour >= 6 && hour <= 18) {
      score += 10;
    } else {
      score += 3;
    }
  } else if (context.travel.type === 'business') {
    // Business travelers prefer early morning or late evening
    if ((hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 22)) {
      score += 10;
    } else {
      score += 5;
    }
  } else {
    // Default: any reasonable time
    if (hour >= 6 && hour <= 22) {
      score += 8;
    } else {
      score += 4;
    }
  }
  
  // 5. CLASS PREFERENCE (Weight: 10%)
  const preferredClass = context.preferences.transportation === 'business' ? 'Business' : 'Economy';
  if (flight.class === preferredClass) {
    score += 10;
  }
  
  return Math.min(score, 100);
};

/**
 * Parse duration string to hours
 */
const parseDuration = (duration) => {
  const match = duration.match(/(\d+)h\s*(\d+)?m?/);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return hours + minutes / 60;
  }
  return 0;
};

/**
 * Recommend flights
 */
export const recommendFlights = (context, limit = 3) => {
  if (!context.destination) {
    return [];
  }
  
  // Filter by destination (to city)
  const filteredFlights = flights.filter(
    f => f.toCity.toLowerCase() === context.destination.toLowerCase()
  );
  
  // Score each flight
  const scoredFlights = filteredFlights.map(flight => ({
    ...flight,
    score: scoreFlight(flight, context),
    matchReason: generateFlightMatchReason(flight, context),
  }));
  
  // Sort by score
  scoredFlights.sort((a, b) => b.score - a.score);
  
  return scoredFlights.slice(0, limit);
};

/**
 * Generate flight match reason
 */
const generateFlightMatchReason = (flight, context) => {
  const reasons = [];
  
  if (flight.stops === 0) {
    reasons.push('Direct flight');
  }
  
  const durationHours = parseDuration(flight.duration);
  if (durationHours <= 4) {
    reasons.push('Short duration');
  }
  
  if (flight.class === 'Business') {
    reasons.push('Premium travel experience');
  }
  
  const hour = parseInt(flight.departure.split(':')[0]);
  if (hour >= 6 && hour <= 12) {
    reasons.push('Convenient morning departure');
  }
  
  if (flight.refundable) {
    reasons.push('Flexible cancellation');
  }
  
  return reasons.join(', ');
};

// ============================================
// ACTIVITY RECOMMENDATION ENGINE
// ============================================

/**
 * Score activity based on context
 */
const scoreActivity = (activity, context) => {
  let score = 0;
  
  // 1. CATEGORY MATCH (Weight: 35%)
  if (context.preferences.activities.length > 0) {
    if (context.preferences.activities.includes(activity.category)) {
      score += 35;
    } else {
      score += 10;
    }
  } else {
    // Default scoring based on travel type
    const typeToCategory = {
      family: ['sightseeing', 'adventure', 'cultural'],
      couple: ['sightseeing', 'relaxation', 'dining'],
      friends: ['adventure', 'shopping', 'sightseeing'],
      solo: ['cultural', 'sightseeing', 'adventure'],
      business: ['sightseeing', 'dining'],
    };
    
    if (typeToCategory[context.travel.type]?.includes(activity.category)) {
      score += 25;
    } else {
      score += 10;
    }
  }
  
  // 2. PRICE SCORING (Weight: 25%)
  const activityBudget = 5000; // Default per-activity budget
  if (activity.price <= activityBudget * 0.5) {
    score += 25;
  } else if (activity.price <= activityBudget) {
    score += 20;
  } else if (activity.price <= activityBudget * 1.5) {
    score += 12;
  } else {
    score += 5;
  }
  
  // 3. RATING SCORING (Weight: 25%)
  score += (activity.rating / 10) * 25;
  
  // 4. FAMILY-FRIENDLY (Weight: 15%)
  if (context.travel.type === 'family') {
    if (activity.familyFriendly) {
      score += 15;
    } else {
      score += 3;
    }
  } else {
    score += 10; // Neutral
  }
  
  return Math.min(score, 100);
};

/**
 * Recommend activities
 */
export const recommendActivities = (context, limit = 5) => {
  if (!context.destination) {
    return [];
  }
  
  // Filter by destination
  const filteredActivities = activities.filter(
    a => a.destination.toLowerCase() === context.destination.toLowerCase()
  );
  
  // Score each activity
  const scoredActivities = filteredActivities.map(activity => ({
    ...activity,
    score: scoreActivity(activity, context),
    matchReason: generateActivityMatchReason(activity, context),
  }));
  
  // Sort by score and diversify categories
  scoredActivities.sort((a, b) => b.score - a.score);
  
  // Ensure diversity in categories
  const diversified = [];
  const usedCategories = new Set();
  
  for (const activity of scoredActivities) {
    if (diversified.length >= limit) break;
    
    if (usedCategories.size < 3 || !usedCategories.has(activity.category)) {
      diversified.push(activity);
      usedCategories.add(activity.category);
    }
  }
  
  // Fill remaining slots if needed
  if (diversified.length < limit) {
    for (const activity of scoredActivities) {
      if (diversified.length >= limit) break;
      if (!diversified.find(a => a.id === activity.id)) {
        diversified.push(activity);
      }
    }
  }
  
  return diversified;
};

/**
 * Generate activity match reason
 */
const generateActivityMatchReason = (activity, context) => {
  const reasons = [];
  
  if (activity.rating >= 9.0) {
    reasons.push('Highly recommended');
  }
  
  if (context.travel.type === 'family' && activity.familyFriendly) {
    reasons.push('Great for families');
  }
  
  if (activity.category === 'adventure') {
    reasons.push('Thrilling experience');
  }
  
  if (activity.category === 'cultural') {
    reasons.push('Rich cultural experience');
  }
  
  if (activity.price <= 2000) {
    reasons.push('Budget-friendly');
  }
  
  return reasons.join(', ');
};

// ============================================
// COMPLETE RECOMMENDATION PACKAGE
// ============================================

/**
 * Generate complete recommendations
 * @param {Object} context - User context
 * @returns {Object} - Complete recommendation package
 */
export const generateRecommendations = (context) => {
  return {
    hotels: recommendHotels(context, 5),
    flights: recommendFlights(context, 3),
    activities: recommendActivities(context, 6),
    metadata: {
      recommendationId: generateRecommendationId(),
      timestamp: new Date().toISOString(),
      context: {
        destination: context.destination,
        budget: context.budget.amount,
        duration: context.duration,
        travelType: context.travel.type,
      },
    },
  };
};

/**
 * Generate unique recommendation ID
 */
const generateRecommendationId = () => {
  return `REC-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Calculate estimated trip cost
 */
export const calculateEstimatedCost = (recommendations, context) => {
  const costs = {
    flights: 0,
    accommodation: 0,
    activities: 0,
    meals: 0,
    transportation: 0,
    miscellaneous: 0,
  };
  
  // Flight cost (round trip)
  if (recommendations.flights.length > 0) {
    const avgFlightCost = recommendations.flights[0].price;
    costs.flights = avgFlightCost * 2 * (context.travel.count || 1);
  }
  
  // Accommodation cost
  if (recommendations.hotels.length > 0) {
    const avgHotelCost = recommendations.hotels[0].price;
    const nights = (context.duration || 3) - 1;
    costs.accommodation = avgHotelCost * nights;
  }
  
  // Activities cost (assume 1-2 activities per day)
  if (recommendations.activities.length > 0) {
    const avgActivityCost = recommendations.activities.slice(0, 3).reduce((sum, a) => sum + a.price, 0) / 3;
    costs.activities = avgActivityCost * (context.duration || 3) * (context.travel.count || 1);
  }
  
  // Meals (estimate ₹1500 per person per day)
  costs.meals = 1500 * (context.duration || 3) * (context.travel.count || 1);
  
  // Local transportation (estimate ₹800 per day)
  costs.transportation = 800 * (context.duration || 3);
  
  // Miscellaneous (10% of total)
  const subtotal = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  costs.miscellaneous = subtotal * 0.1;
  
  const total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  
  return {
    breakdown: costs,
    total: Math.round(total),
    perPerson: Math.round(total / (context.travel.count || 1)),
    currency: 'INR',
  };
};
