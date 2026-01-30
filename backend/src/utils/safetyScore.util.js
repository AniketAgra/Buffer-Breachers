/**
 * SAFETY SCORE UTILITY
 * 
 * This module calculates safety scores and generates warnings for destinations.
 * Uses rule-based assessment (NO ML).
 */

import { safetyData, destinations } from './mockData.util.js';

/**
 * Get safety score for destination
 * @param {string} destinationName - Destination name
 * @returns {Object} - Safety assessment
 */
export const getSafetyScore = (destinationName) => {
  const safety = safetyData[destinationName];
  
  if (!safety) {
    return {
      found: false,
      overallScore: 7.0, // Default neutral score
      message: 'Safety data not available for this destination',
    };
  }
  
  return {
    found: true,
    overallScore: safety.overallScore,
    categories: safety.categories,
    warnings: safety.warnings,
    emergencyContacts: safety.emergencyContacts,
    tips: safety.tips,
    assessment: getScoreAssessment(safety.overallScore),
  };
};

/**
 * Get textual assessment from score
 */
const getScoreAssessment = (score) => {
  if (score >= 9.0) {
    return 'Excellent - Very safe destination';
  } else if (score >= 8.0) {
    return 'Good - Generally safe with standard precautions';
  } else if (score >= 7.0) {
    return 'Moderate - Safe with awareness and precautions';
  } else if (score >= 6.0) {
    return 'Fair - Extra caution recommended';
  } else {
    return 'Caution - Enhanced vigilance required';
  }
};

/**
 * Generate safety warnings based on context
 * @param {string} destinationName - Destination name
 * @param {Object} context - User context
 * @returns {Array} - Array of warnings
 */
export const generateSafetyWarnings = (destinationName, context) => {
  const safety = safetyData[destinationName];
  const warnings = [];
  
  if (!safety) {
    return warnings;
  }
  
  // Add general warnings
  if (safety.warnings) {
    warnings.push(...safety.warnings);
  }
  
  // Women traveler specific warnings
  if (context.travel.type === 'solo' || context.preferences?.womenTraveler) {
    if (safety.categories.womenSafety < 8.0) {
      warnings.push({
        type: 'women-safety',
        severity: 'high',
        message: 'Women travelers should exercise extra caution, especially after dark',
      });
    }
  }
  
  // Late-night arrival warnings
  if (context.arrivalTime && isLateNight(context.arrivalTime)) {
    if (safety.categories.crime < 8.0) {
      warnings.push({
        type: 'time-sensitive',
        severity: 'medium',
        message: 'Late-night arrival detected. Book airport transfer in advance and avoid public transport',
      });
    }
  }
  
  // Solo traveler warnings
  if (context.travel.type === 'solo') {
    if (safety.categories.soloTraveler < 8.0) {
      warnings.push({
        type: 'solo-traveler',
        severity: 'medium',
        message: 'Solo travelers should stay in well-populated areas and inform someone of their plans',
      });
    }
  }
  
  // Family warnings
  if (context.travel.type === 'family') {
    if (safety.categories.health < 7.5) {
      warnings.push({
        type: 'health',
        severity: 'medium',
        message: 'Families with children should be extra careful about food and water safety',
      });
    }
  }
  
  // Budget travel warnings
  if (context.budget.preference === 'budget') {
    warnings.push({
      type: 'general',
      severity: 'low',
      message: 'Budget accommodations may be in less secure areas. Research locations carefully',
    });
  }
  
  return warnings;
};

/**
 * Check if time is late night (10 PM - 5 AM)
 */
const isLateNight = (time) => {
  const hour = parseInt(time.split(':')[0]);
  return hour >= 22 || hour <= 5;
};

/**
 * Get area-wise safety ratings
 * @param {string} destinationName - Destination name
 * @returns {Array} - Area safety ratings
 */
export const getAreaSafetyRatings = (destinationName) => {
  // Mock area-wise ratings (in production, this would come from a detailed database)
  const areaRatings = {
    Dubai: [
      { area: 'Dubai Marina', score: 9.2, description: 'Very safe, well-policed tourist area' },
      { area: 'Downtown Dubai', score: 9.0, description: 'Safe, busy commercial district' },
      { area: 'Deira', score: 7.8, description: 'Generally safe, watch belongings in crowded markets' },
      { area: 'Bur Dubai', score: 7.5, description: 'Safe but crowded, be aware of pickpockets' },
    ],
    Goa: [
      { area: 'North Goa (Baga, Calangute)', score: 7.5, description: 'Busy tourist area, safe during day, caution at night' },
      { area: 'South Goa (Palolem, Agonda)', score: 8.2, description: 'Quieter, family-friendly beaches' },
      { area: 'Panaji City', score: 8.0, description: 'Capital city, generally safe' },
      { area: 'Old Goa', score: 8.5, description: 'Heritage area, very safe during day' },
    ],
    Singapore: [
      { area: 'Marina Bay', score: 9.8, description: 'Extremely safe, heavily monitored' },
      { area: 'Orchard Road', score: 9.7, description: 'Shopping district, very safe' },
      { area: 'Chinatown', score: 9.5, description: 'Tourist area, very safe' },
      { area: 'Sentosa', score: 9.9, description: 'Resort island, maximum security' },
    ],
  };
  
  return areaRatings[destinationName] || [];
};

/**
 * Generate safety tips based on context
 * @param {string} destinationName - Destination name
 * @param {Object} context - User context
 * @returns {Array} - Personalized safety tips
 */
export const generateSafetyTips = (destinationName, context) => {
  const safety = safetyData[destinationName];
  const tips = [];
  
  if (safety && safety.tips) {
    tips.push(...safety.tips);
  }
  
  // Add context-specific tips
  if (context.travel.type === 'family') {
    tips.push('Keep children within sight in crowded areas');
    tips.push('Carry a first-aid kit and necessary medications');
  }
  
  if (context.travel.type === 'solo') {
    tips.push('Share your itinerary with family/friends');
    tips.push('Use reputable accommodation and transportation');
  }
  
  if (context.budget.preference === 'budget') {
    tips.push('Research accommodation locations for safety');
    tips.push('Use official tourist transportation when possible');
  }
  
  // General tips
  tips.push('Keep copies of important documents separately');
  tips.push('Get travel insurance');
  tips.push('Register with your embassy if traveling internationally');
  
  return [...new Set(tips)]; // Remove duplicates
};

/**
 * Assess risk level for specific activity
 * @param {string} destinationName - Destination name
 * @param {string} activityType - Type of activity
 * @returns {Object} - Risk assessment
 */
export const assessActivityRisk = (destinationName, activityType) => {
  const safety = safetyData[destinationName];
  const baseScore = safety ? safety.overallScore : 7.0;
  
  // Activity risk multipliers
  const activityRisks = {
    adventure: { multiplier: 0.9, risks: ['Physical injury', 'Equipment failure'] },
    water: { multiplier: 0.85, risks: ['Drowning', 'Marine life'] },
    nightlife: { multiplier: 0.8, risks: ['Theft', 'Drinks tampering'] },
    hiking: { multiplier: 0.88, risks: ['Getting lost', 'Weather changes'] },
    cultural: { multiplier: 0.98, risks: ['Minimal risks'] },
    shopping: { multiplier: 0.95, risks: ['Pickpocketing'] },
    sightseeing: { multiplier: 0.97, risks: ['Minimal risks'] },
  };
  
  const activityRisk = activityRisks[activityType] || { multiplier: 0.95, risks: [] };
  const adjustedScore = baseScore * activityRisk.multiplier;
  
  return {
    activityType,
    safetyScore: parseFloat(adjustedScore.toFixed(1)),
    potentialRisks: activityRisk.risks,
    recommendations: generateActivityRecommendations(activityType, adjustedScore),
  };
};

/**
 * Generate recommendations for activity
 */
const generateActivityRecommendations = (activityType, score) => {
  const recommendations = [];
  
  if (score < 7.0) {
    recommendations.push('Consider booking through reputable operators only');
    recommendations.push('Ensure proper insurance coverage');
  }
  
  if (activityType === 'adventure' || activityType === 'water') {
    recommendations.push('Check operator certifications and safety equipment');
    recommendations.push('Follow all safety instructions carefully');
  }
  
  if (activityType === 'nightlife') {
    recommendations.push('Stay in groups, don\'t accept drinks from strangers');
    recommendations.push('Keep valuables secured, use official taxis');
  }
  
  recommendations.push('Keep emergency contacts handy');
  
  return recommendations;
};

/**
 * Generate comprehensive safety report
 * @param {string} destinationName - Destination name
 * @param {Object} context - User context
 * @returns {Object} - Complete safety report
 */
export const generateSafetyReport = (destinationName, context) => {
  const safetyScore = getSafetyScore(destinationName);
  const warnings = generateSafetyWarnings(destinationName, context);
  const areaSafety = getAreaSafetyRatings(destinationName);
  const tips = generateSafetyTips(destinationName, context);
  
  return {
    destination: destinationName,
    overallScore: safetyScore.overallScore,
    categoryScores: safetyScore.categories || {},
    categories: safetyScore.categories || {},
    assessment: safetyScore.assessment,
    emergencyContacts: safetyScore.emergencyContacts || [],
    warnings,
    recommendations: tips, // Add recommendations as alias for tips
    areaSafety,
    tips,
    timestamp: new Date().toISOString(),
    contextualized: true,
  };
};

/**
 * Check if destination is safe for specific demographic
 * @param {string} destinationName - Destination name
 * @param {string} demographic - 'women', 'solo', 'family', 'elderly'
 * @returns {Object} - Safety status
 */
export const checkDemographicSafety = (destinationName, demographic) => {
  const safety = safetyData[destinationName];
  
  if (!safety) {
    return { safe: true, score: 7.0, notes: 'Limited data available' };
  }
  
  const demographicScores = {
    women: safety.categories.womenSafety,
    solo: safety.categories.soloTraveler,
    family: Math.min(safety.categories.crime, safety.categories.health),
    elderly: safety.categories.health,
  };
  
  const score = demographicScores[demographic] || safety.overallScore;
  
  return {
    safe: score >= 7.0,
    score,
    level: getScoreAssessment(score),
    notes: generateDemographicNotes(demographic, score),
  };
};

/**
 * Generate demographic-specific notes
 */
const generateDemographicNotes = (demographic, score) => {
  if (score >= 8.5) {
    return `Excellent safety for ${demographic} travelers`;
  } else if (score >= 7.5) {
    return `Generally safe for ${demographic} travelers with standard precautions`;
  } else if (score >= 6.5) {
    return `Safe for ${demographic} travelers with extra awareness`;
  } else {
    return `${demographic} travelers should exercise enhanced caution`;
  }
};
