/**
 * PRICING ENGINE UTILITY
 * 
 * This module handles dynamic pricing logic and budget optimization.
 * Includes surge pricing simulation, discounts, and cost breakdown.
 */

/**
 * Calculate dynamic price with surge pricing
 * @param {number} basePrice - Base price
 * @param {Object} factors - Pricing factors
 * @returns {number} - Adjusted price
 */
export const calculateDynamicPrice = (basePrice, factors = {}) => {
  let price = basePrice;
  
  // Season multiplier
  if (factors.season === 'peak') {
    price *= 1.4; // 40% increase
  } else if (factors.season === 'high') {
    price *= 1.2; // 20% increase
  } else if (factors.season === 'low') {
    price *= 0.8; // 20% discount
  }
  
  // Advance booking discount
  if (factors.daysInAdvance) {
    if (factors.daysInAdvance > 60) {
      price *= 0.85; // 15% early bird discount
    } else if (factors.daysInAdvance > 30) {
      price *= 0.90; // 10% discount
    } else if (factors.daysInAdvance < 7) {
      price *= 1.15; // 15% last-minute premium
    }
  }
  
  // Demand multiplier
  if (factors.demand === 'high') {
    price *= 1.15;
  } else if (factors.demand === 'low') {
    price *= 0.9;
  }
  
  // Group discount
  if (factors.groupSize && factors.groupSize >= 4) {
    price *= 0.95; // 5% group discount
  } else if (factors.groupSize && factors.groupSize >= 8) {
    price *= 0.90; // 10% large group discount
  }
  
  return Math.round(price);
};

/**
 * Optimize budget allocation
 * @param {number} totalBudget - Total budget
 * @param {number} duration - Trip duration
 * @param {string} travelType - Type of travel
 * @returns {Object} - Budget breakdown
 */
export const optimizeBudget = (totalBudget, duration, travelType = 'solo') => {
  // Budget allocation percentages based on travel type
  const allocations = {
    solo: {
      flights: 0.30,
      accommodation: 0.30,
      activities: 0.20,
      meals: 0.12,
      transportation: 0.05,
      miscellaneous: 0.03,
    },
    family: {
      flights: 0.35,
      accommodation: 0.30,
      activities: 0.15,
      meals: 0.12,
      transportation: 0.05,
      miscellaneous: 0.03,
    },
    luxury: {
      flights: 0.25,
      accommodation: 0.40,
      activities: 0.18,
      meals: 0.10,
      transportation: 0.05,
      miscellaneous: 0.02,
    },
    budget: {
      flights: 0.35,
      accommodation: 0.25,
      activities: 0.15,
      meals: 0.15,
      transportation: 0.07,
      miscellaneous: 0.03,
    },
  };
  
  const allocation = allocations[travelType] || allocations.solo;
  
  const breakdown = {
    flights: Math.round(totalBudget * allocation.flights),
    accommodation: Math.round(totalBudget * allocation.accommodation),
    activities: Math.round(totalBudget * allocation.activities),
    meals: Math.round(totalBudget * allocation.meals),
    transportation: Math.round(totalBudget * allocation.transportation),
    miscellaneous: Math.round(totalBudget * allocation.miscellaneous),
  };
  
  // Add per-day breakdowns
  breakdown.perDay = {
    accommodation: Math.round(breakdown.accommodation / Math.max(duration - 1, 1)),
    meals: Math.round(breakdown.meals / duration),
    activities: Math.round(breakdown.activities / duration),
    transportation: Math.round(breakdown.transportation / duration),
  };
  
  return breakdown;
};

/**
 * Calculate refund amount based on cancellation policy
 * @param {number} bookingAmount - Original booking amount
 * @param {Object} policy - Cancellation policy
 * @param {number} daysBeforeCheckIn - Days before check-in
 * @returns {Object} - Refund details
 */
export const calculateRefund = (bookingAmount, policy, daysBeforeCheckIn) => {
  if (!policy.refundable) {
    return {
      refundable: false,
      refundAmount: 0,
      cancellationFee: bookingAmount,
      message: 'Non-refundable booking',
    };
  }
  
  let refundPercentage = 100;
  let cancellationFee = policy.cancellationFee || 0;
  
  // Apply tiered refund policy
  if (daysBeforeCheckIn >= 30) {
    refundPercentage = 100;
    cancellationFee = 0;
  } else if (daysBeforeCheckIn >= 15) {
    refundPercentage = 80;
    cancellationFee = bookingAmount * 0.20;
  } else if (daysBeforeCheckIn >= 7) {
    refundPercentage = 60;
    cancellationFee = bookingAmount * 0.40;
  } else if (daysBeforeCheckIn >= 3) {
    refundPercentage = 40;
    cancellationFee = bookingAmount * 0.60;
  } else {
    refundPercentage = 0;
    cancellationFee = bookingAmount;
  }
  
  const refundAmount = Math.round((bookingAmount * refundPercentage) / 100);
  
  return {
    refundable: true,
    refundPercentage,
    refundAmount,
    cancellationFee: Math.round(cancellationFee),
    message: `${refundPercentage}% refund applicable`,
  };
};

/**
 * Calculate payment breakdown with taxes
 * @param {number} baseAmount - Base amount
 * @param {string} bookingType - Type of booking
 * @returns {Object} - Payment breakdown
 */
export const calculatePaymentBreakdown = (baseAmount, bookingType) => {
  const breakdown = {
    baseAmount,
    taxes: {},
    fees: {},
    total: 0,
  };
  
  // GST (Goods and Services Tax) - India
  if (bookingType === 'hotel') {
    breakdown.taxes.gst = Math.round(baseAmount * 0.12); // 12% GST
  } else if (bookingType === 'flight') {
    breakdown.taxes.gst = Math.round(baseAmount * 0.05); // 5% GST
  } else {
    breakdown.taxes.gst = Math.round(baseAmount * 0.18); // 18% GST
  }
  
  // Service fee
  breakdown.fees.serviceFee = Math.round(baseAmount * 0.02); // 2% service fee
  
  // Convenience fee (for cards)
  breakdown.fees.convenienceFee = 100; // Flat ₹100
  
  // Calculate total
  const totalTaxes = Object.values(breakdown.taxes).reduce((sum, tax) => sum + tax, 0);
  const totalFees = Object.values(breakdown.fees).reduce((sum, fee) => sum + fee, 0);
  breakdown.total = baseAmount + totalTaxes + totalFees;
  
  return breakdown;
};

/**
 * Suggest budget optimizations
 * @param {Object} currentCost - Current cost breakdown
 * @param {number} userBudget - User's budget
 * @returns {Array} - Optimization suggestions
 */
export const suggestOptimizations = (currentCost, userBudget) => {
  const suggestions = [];
  
  if (currentCost.total > userBudget) {
    const overBudget = currentCost.total - userBudget;
    const overPercentage = ((overBudget / userBudget) * 100).toFixed(1);
    
    suggestions.push({
      type: 'alert',
      message: `Current plan exceeds budget by ₹${overBudget.toLocaleString()} (${overPercentage}%)`,
      severity: 'high',
    });
    
    // Suggest cheaper accommodation
    if (currentCost.accommodation > userBudget * 0.35) {
      suggestions.push({
        type: 'accommodation',
        message: 'Consider choosing a more budget-friendly hotel',
        potentialSaving: Math.round(currentCost.accommodation * 0.3),
      });
    }
    
    // Suggest fewer activities
    if (currentCost.activities > userBudget * 0.25) {
      suggestions.push({
        type: 'activities',
        message: 'Reduce paid activities or choose free attractions',
        potentialSaving: Math.round(currentCost.activities * 0.4),
      });
    }
    
    // Suggest cheaper flights
    if (currentCost.flights > userBudget * 0.35) {
      suggestions.push({
        type: 'flights',
        message: 'Look for flights with layovers or different times',
        potentialSaving: Math.round(currentCost.flights * 0.2),
      });
    }
    
    // Suggest shorter duration
    suggestions.push({
      type: 'duration',
      message: 'Consider shortening the trip by 1-2 days',
      potentialSaving: Math.round(overBudget * 0.6),
    });
  } else if (currentCost.total < userBudget * 0.7) {
    const underBudget = userBudget - currentCost.total;
    
    suggestions.push({
      type: 'info',
      message: `You have ₹${underBudget.toLocaleString()} remaining in your budget`,
      severity: 'low',
    });
    
    // Suggest upgrades
    suggestions.push({
      type: 'upgrade',
      message: 'Consider upgrading to a better hotel or premium experiences',
      additionalCost: Math.round(underBudget * 0.5),
    });
    
    suggestions.push({
      type: 'upgrade',
      message: 'Add more activities or extend your stay',
      additionalCost: Math.round(underBudget * 0.3),
    });
  } else {
    suggestions.push({
      type: 'success',
      message: 'Your plan is well-optimized for your budget!',
      severity: 'low',
    });
  }
  
  return suggestions;
};

/**
 * Calculate price comparison
 * @param {number} price - Current price
 * @param {string} destination - Destination
 * @returns {Object} - Price comparison
 */
export const comparePrices = (price, destination) => {
  // Mock average prices for comparison
  const averagePrices = {
    Dubai: { hotel: 20000, flight: 22000, activity: 3500 },
    Goa: { hotel: 8000, flight: 4000, activity: 1500 },
    Singapore: { hotel: 18000, flight: 26000, activity: 3000 },
    Maldives: { hotel: 35000, flight: 32000, activity: 4500 },
    Bangkok: { hotel: 12000, flight: 18000, activity: 2000 },
  };
  
  const avgPrice = averagePrices[destination]?.hotel || 15000;
  const difference = price - avgPrice;
  const percentDiff = ((difference / avgPrice) * 100).toFixed(1);
  
  return {
    currentPrice: price,
    averagePrice: avgPrice,
    difference,
    percentDifference: percentDiff,
    status: difference > 0 ? 'above-average' : 'below-average',
    message:
      difference > 0
        ? `${percentDiff}% higher than average`
        : `${Math.abs(percentDiff)}% lower than average`,
  };
};

/**
 * Calculate best time to book for price optimization
 * @param {Date} travelDate - Travel date
 * @returns {Object} - Booking recommendation
 */
export const calculateBestBookingTime = (travelDate) => {
  const now = new Date();
  const daysUntilTravel = Math.floor((travelDate - now) / (1000 * 60 * 60 * 24));
  
  let recommendation = '';
  let expectedSaving = 0;
  
  if (daysUntilTravel > 90) {
    recommendation = 'Excellent time to book! You can get early bird discounts.';
    expectedSaving = 15;
  } else if (daysUntilTravel > 60) {
    recommendation = 'Good time to book with decent prices.';
    expectedSaving = 10;
  } else if (daysUntilTravel > 30) {
    recommendation = 'Book soon to avoid price increases.';
    expectedSaving = 5;
  } else if (daysUntilTravel > 14) {
    recommendation = 'Prices are rising. Book immediately if possible.';
    expectedSaving = 0;
  } else {
    recommendation = 'Last-minute booking. Expect premium prices.';
    expectedSaving = -15;
  }
  
  return {
    daysUntilTravel,
    recommendation,
    expectedSavingPercentage: expectedSaving,
    urgency: daysUntilTravel < 30 ? 'high' : daysUntilTravel < 60 ? 'medium' : 'low',
  };
};
