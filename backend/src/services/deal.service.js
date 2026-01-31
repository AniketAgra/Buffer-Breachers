/**
 * DEAL SERVICE
 * 
 * Core service for agents to find, compare, and optimize travel deals.
 * Helps agents ensure NO best deals are missed.
 */

import { Trip } from '../models/Trip.model.js';
import { calculateDynamicPrice } from '../utils/pricingEngine.util.js';
import { getSafetyScore } from '../utils/safetyScore.util.js';
import { destinations } from '../utils/mockData.util.js';

/**
 * Fetch and compare available deals for a destination
 * @param {Object} criteria - Search criteria
 * @returns {Object} - Comparison results with alternatives
 */
export const compareDeals = async (criteria) => {
  const {
    destination,
    startDate,
    endDate,
    budget,
    travelers,
    preferences = {},
  } = criteria;

  try {
    // Get all available trips/packages for destination
    const availableDeals = await Trip.find({
      destination: { $regex: destination, $options: 'i' },
      availableFrom: { $lte: new Date(startDate) },
      availableTo: { $gte: new Date(endDate) },
      status: 'active',
    }).limit(10);

    // If no DB deals, generate mock deals from destinations
    let deals = availableDeals.length > 0 
      ? availableDeals.map(deal => formatDealFromDB(deal, criteria))
      : generateMockDeals(destination, criteria);

    // Score and rank each deal
    deals = deals.map(deal => ({
      ...deal,
      scores: scoreDeal(deal, criteria),
    }));

    // Sort by composite score
    deals.sort((a, b) => b.scores.composite - a.scores.composite);

    // Identify best deal
    const bestDeal = deals[0];

    // Find alternatives and flag warnings
    const alternatives = deals.slice(1, 6).map(alt => ({
      ...alt,
      comparison: compareToBest(alt, bestDeal),
    }));

    return {
      success: true,
      bestDeal,
      alternatives,
      totalDealsAnalyzed: deals.length,
      insights: generateInsights(bestDeal, alternatives, criteria),
    };
  } catch (error) {
    throw new Error(`Deal comparison failed: ${error.message}`);
  }
};

/**
 * Score a deal based on multiple factors
 */
const scoreDeal = (deal, criteria) => {
  const scores = {};

  // Price score (0-100, lower price = higher score)
  const priceRatio = deal.totalPrice / criteria.budget;
  if (priceRatio <= 0.7) {
    scores.price = 100;
  } else if (priceRatio <= 0.9) {
    scores.price = 80;
  } else if (priceRatio <= 1.0) {
    scores.price = 60;
  } else if (priceRatio <= 1.2) {
    scores.price = 40;
  } else {
    scores.price = 20;
  }

  // Safety score (0-100, from 0-10 scale)
  scores.safety = (deal.safetyScore / 10) * 100;

  // Rating score (0-100, from 0-5 scale)
  scores.rating = (deal.rating / 5) * 100;

  // Preference match score (0-100)
  scores.preferenceMatch = calculatePreferenceMatch(deal, criteria.preferences);

  // Value score (quality vs price)
  scores.value = (scores.rating + scores.safety) / 2 * (100 / priceRatio);
  scores.value = Math.min(scores.value, 100);

  // Composite score (weighted average)
  const weights = {
    price: 0.30,
    safety: 0.25,
    rating: 0.20,
    preferenceMatch: 0.15,
    value: 0.10,
  };

  scores.composite = 
    scores.price * weights.price +
    scores.safety * weights.safety +
    scores.rating * weights.rating +
    scores.preferenceMatch * weights.preferenceMatch +
    scores.value * weights.value;

  return scores;
};

/**
 * Calculate preference match score
 */
const calculatePreferenceMatch = (deal, preferences) => {
  let score = 50; // Base score

  if (preferences.accommodation && deal.accommodationType === preferences.accommodation) {
    score += 20;
  }

  if (preferences.mealPreference && deal.meals?.includes(preferences.mealPreference)) {
    score += 15;
  }

  if (preferences.activities && deal.activities) {
    const matchingActivities = deal.activities.filter(a => 
      preferences.activities.some(pa => a.toLowerCase().includes(pa.toLowerCase()))
    );
    score += Math.min((matchingActivities.length / deal.activities.length) * 15, 15);
  }

  return Math.min(score, 100);
};

/**
 * Compare alternative to best deal
 */
const compareToBest = (alternative, best) => {
  const comparison = {
    priceDifference: alternative.totalPrice - best.totalPrice,
    priceDifferencePercent: ((alternative.totalPrice - best.totalPrice) / best.totalPrice * 100).toFixed(1),
    safetyDifference: (alternative.safetyScore - best.safetyScore).toFixed(1),
    ratingDifference: (alternative.rating - best.rating).toFixed(1),
    scoreDifference: (alternative.scores.composite - best.scores.composite).toFixed(1),
  };

  // Generate comparison message
  if (comparison.priceDifference > 0 && alternative.safetyScore > best.safetyScore) {
    comparison.message = `₹${Math.abs(comparison.priceDifference)} more expensive but ${comparison.safetyDifference} points safer`;
  } else if (comparison.priceDifference < 0 && alternative.rating < best.rating) {
    comparison.message = `₹${Math.abs(comparison.priceDifference)} cheaper but ${Math.abs(comparison.ratingDifference)} points lower rated`;
  } else if (comparison.priceDifference < 0) {
    comparison.message = `₹${Math.abs(comparison.priceDifference)} cheaper with comparable quality`;
  } else {
    comparison.message = `Similar value with different trade-offs`;
  }

  return comparison;
};

/**
 * Generate insights for agent
 */
const generateInsights = (bestDeal, alternatives, criteria) => {
  const insights = [];

  // Budget insight
  if (bestDeal.totalPrice < criteria.budget * 0.8) {
    insights.push({
      type: 'savings',
      severity: 'good',
      message: `Best deal is ₹${criteria.budget - bestDeal.totalPrice} under budget. Consider upgrading accommodation or adding activities.`,
    });
  } else if (bestDeal.totalPrice > criteria.budget) {
    insights.push({
      type: 'budget',
      severity: 'warning',
      message: `Best deal exceeds budget by ₹${bestDeal.totalPrice - criteria.budget}. Review alternatives or adjust expectations.`,
    });
  }

  // Safety insight
  if (bestDeal.safetyScore < 7.0) {
    const saferAlternatives = alternatives.filter(alt => alt.safetyScore > bestDeal.safetyScore);
    if (saferAlternatives.length > 0) {
      insights.push({
        type: 'safety',
        severity: 'warning',
        message: `${saferAlternatives.length} safer alternatives available. Review safety requirements with client.`,
      });
    }
  }

  // Value insight
  const valuableAlternatives = alternatives.filter(alt => 
    alt.totalPrice < bestDeal.totalPrice * 0.9 && 
    alt.rating >= bestDeal.rating - 0.5
  );
  if (valuableAlternatives.length > 0) {
    insights.push({
      type: 'value',
      severity: 'info',
      message: `Found ${valuableAlternatives.length} alternatives with similar quality at lower prices.`,
    });
  }

  // Seasonal insight
  const date = new Date(criteria.startDate);
  const month = date.getMonth();
  if ([11, 0, 1, 4, 5].includes(month)) { // Dec, Jan, Feb, May, June
    insights.push({
      type: 'seasonal',
      severity: 'info',
      message: 'Peak season detected. Prices are 20-40% higher than off-season. Early booking recommended.',
    });
  }

  return insights;
};

/**
 * Generate mock deals from destinations data
 */
const generateMockDeals = (destination, criteria) => {
  const dest = destinations.find(d => 
    d.name.toLowerCase().includes(destination.toLowerCase()) ||
    destination.toLowerCase().includes(d.name.toLowerCase())
  );

  if (!dest) {
    return [];
  }

  const duration = Math.ceil((new Date(criteria.endDate) - new Date(criteria.startDate)) / (1000 * 60 * 60 * 24));
  const basePrice = dest.avgPrice || 15000;

  // Generate 5 package variations
  const packages = [
    { name: 'Budget Explorer', priceMultiplier: 0.7, accommodationType: 'hostel', rating: 3.5 },
    { name: 'Smart Traveler', priceMultiplier: 0.85, accommodationType: 'hotel', rating: 4.0 },
    { name: 'Comfort Plus', priceMultiplier: 1.0, accommodationType: 'hotel', rating: 4.3 },
    { name: 'Premium Experience', priceMultiplier: 1.3, accommodationType: 'resort', rating: 4.6 },
    { name: 'Luxury Escape', priceMultiplier: 1.8, accommodationType: 'resort', rating: 4.8 },
  ];

  return packages.map((pkg, index) => {
    const price = calculateDynamicPrice(basePrice * pkg.priceMultiplier * duration, {
      season: 'high',
      daysInAdvance: 30,
      groupSize: criteria.travelers,
    });

    const safety = getSafetyScore(dest.name);

    return {
      id: `deal_${index + 1}`,
      packageName: `${dest.name} - ${pkg.name}`,
      destination: dest.name,
      duration,
      totalPrice: price,
      pricePerPerson: Math.round(price / criteria.travelers),
      accommodationType: pkg.accommodationType,
      rating: pkg.rating,
      safetyScore: safety.overallScore || 7.5,
      activities: dest.activities || ['Sightseeing', 'Local Cuisine', 'Photography'],
      meals: ['Breakfast'],
      transportation: 'Airport transfers included',
      provider: 'TravelHub Plus',
    };
  });
};

/**
 * Format deal from database
 */
const formatDealFromDB = (trip, criteria) => {
  const duration = Math.ceil((new Date(criteria.endDate) - new Date(criteria.startDate)) / (1000 * 60 * 60 * 24));
  const price = trip.pricing?.total || trip.basePrice || 20000;
  const safety = getSafetyScore(trip.destination);

  return {
    id: trip._id.toString(),
    packageName: trip.title || `${trip.destination} Package`,
    destination: trip.destination,
    duration,
    totalPrice: price * criteria.travelers,
    pricePerPerson: price,
    accommodationType: trip.accommodation?.type || 'hotel',
    rating: trip.rating || 4.0,
    safetyScore: safety.overallScore || 7.5,
    activities: trip.activities || [],
    meals: trip.inclusions?.meals || ['Breakfast'],
    transportation: trip.inclusions?.transport || 'Not included',
    provider: 'TravelHub',
  };
};

/**
 * Get deal recommendations for a specific client
 */
export const getClientRecommendations = async (clientId, criteria) => {
  // This would integrate with client preferences and history
  // For now, use standard comparison
  return compareDeals(criteria);
};

/**
 * Validate if selected deal is optimal
 */
export const validateDealSelection = async (selectedDeal, criteria) => {
  const comparison = await compareDeals(criteria);
  
  const warnings = [];
  const bestDeal = comparison.bestDeal;

  // Check if better deals exist
  if (selectedDeal.totalPrice > bestDeal.totalPrice * 1.15) {
    warnings.push({
      type: 'price',
      severity: 'high',
      message: `This deal is ₹${selectedDeal.totalPrice - bestDeal.totalPrice} more expensive than the best available option.`,
      suggestion: `Consider "${bestDeal.packageName}" which offers better value.`,
    });
  }

  if (selectedDeal.safetyScore < bestDeal.safetyScore - 1.0) {
    warnings.push({
      type: 'safety',
      severity: 'high',
      message: `This deal has a lower safety score (${selectedDeal.safetyScore}/10 vs ${bestDeal.safetyScore}/10).`,
      suggestion: 'Review safer alternatives with the client.',
    });
  }

  if (selectedDeal.rating < bestDeal.rating - 0.5) {
    warnings.push({
      type: 'quality',
      severity: 'medium',
      message: `This deal has lower ratings (${selectedDeal.rating}/5 vs ${bestDeal.rating}/5).`,
      suggestion: 'Check reviews and verify quality standards.',
    });
  }

  return {
    isOptimal: warnings.length === 0,
    warnings,
    betterAlternatives: warnings.length > 0 ? [bestDeal, ...comparison.alternatives.slice(0, 2)] : [],
  };
};
