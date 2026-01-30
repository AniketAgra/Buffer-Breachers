/**
 * RESPONSE FORMATTER UTILITY
 * 
 * This module formats AI responses in a conversational and structured manner.
 * Creates human-readable responses from technical data.
 */

/**
 * Format complete copilot response
 * @param {Object} context - User context
 * @param {Object} recommendations - Recommendations
 * @param {Object} itinerary - Generated itinerary
 * @param {Object} safety - Safety information
 * @returns {Object} - Formatted response
 */
export const formatCopilotResponse = (context, recommendations, itinerary, safety) => {
  const intent = context.query.intent;
  
  return {
    intent,
    conversationalResponse: generateConversationalText(context, recommendations, itinerary, safety),
    data: {
      recommendations,
      itinerary,
      safety,
      costEstimate: calculateCostSummary(recommendations, context),
    },
    suggestions: generateFollowUpSuggestions(intent, context),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Generate conversational text response
 */
const generateConversationalText = (context, recommendations, itinerary, safety) => {
  const { destination, duration, budget, travel } = context;
  
  let response = '';
  
  // Greeting and acknowledgment
  response += `Great! I've planned an amazing ${duration}-day trip to **${destination}** for ${travel.type} travelers. `;
  
  // Budget acknowledgment
  if (budget.amount) {
    response += `Based on your budget of ₹${budget.amount.toLocaleString()}, `;
  } else {
    response += `For a ${budget.preference} experience, `;
  }
  
  // Recommendations summary
  if (recommendations.hotels.length > 0) {
    const topHotel = recommendations.hotels[0];
    response += `I recommend staying at **${topHotel.name}** (${topHotel.rating}⭐) in ${topHotel.location}. `;
  }
  
  if (recommendations.flights.length > 0) {
    const topFlight = recommendations.flights[0];
    response += `For flights, ${topFlight.airline} offers a great option at ₹${topFlight.price.toLocaleString()} with ${topFlight.stops === 0 ? 'direct flights' : topFlight.stops + ' stop(s)'}. `;
  }
  
  // Activities highlight
  if (recommendations.activities.length > 0) {
    const activityNames = recommendations.activities.slice(0, 3).map(a => a.name);
    response += `\n\n**Must-do activities:** ${activityNames.join(', ')}. `;
  }
  
  // Safety note
  if (safety) {
    response += `\n\n**Safety Score:** ${safety.overallScore}/10 - ${safety.assessment}. `;
    
    if (safety.warnings && safety.warnings.length > 0) {
      response += `Please note: ${safety.warnings[0].message}. `;
    }
  }
  
  // Itinerary mention
  if (itinerary) {
    response += `\n\nI've created a detailed day-by-day itinerary for you. `;
  }
  
  // Call to action
  response += `\n\nWould you like to see more details about hotels, flights, or activities? Or shall we proceed with booking?`;
  
  return response;
};

/**
 * Calculate cost summary
 */
const calculateCostSummary = (recommendations, context) => {
  const costs = {
    flights: 0,
    accommodation: 0,
    activities: 0,
    meals: 1500 * (context.duration || 3) * (context.travel.count || 1),
    total: 0,
  };
  
  if (recommendations.flights[0]) {
    costs.flights = recommendations.flights[0].price * 2 * (context.travel.count || 1);
  }
  
  if (recommendations.hotels[0]) {
    costs.accommodation = recommendations.hotels[0].price * Math.max((context.duration || 3) - 1, 1);
  }
  
  if (recommendations.activities.length > 0) {
    costs.activities = recommendations.activities
      .slice(0, 4)
      .reduce((sum, a) => sum + a.price, 0) * (context.travel.count || 1);
  }
  
  costs.total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  costs.perPerson = Math.round(costs.total / (context.travel.count || 1));
  
  return costs;
};

/**
 * Generate follow-up suggestions
 */
const generateFollowUpSuggestions = (intent, context) => {
  const suggestions = [];
  
  if (intent === 'TRIP_PLANNING') {
    suggestions.push('Show me detailed hotel options');
    suggestions.push('What activities are available?');
    suggestions.push('Tell me about safety in ' + context.destination);
    suggestions.push('Can you modify the itinerary?');
  } else if (intent === 'HOTEL_SEARCH') {
    suggestions.push('Show me cheaper options');
    suggestions.push('What about 5-star hotels?');
    suggestions.push('Hotels with pool and spa');
  } else if (intent === 'SAFETY_INQUIRY') {
    suggestions.push('What are the emergency contacts?');
    suggestions.push('Is it safe for solo travelers?');
    suggestions.push('Tell me about safe areas to stay');
  }
  
  return suggestions;
};

/**
 * Format error response
 */
export const formatErrorResponse = (error, context) => {
  return {
    success: false,
    error: {
      message: error.message || 'Something went wrong',
      code: error.code || 'UNKNOWN_ERROR',
      details: error.details || null,
    },
    suggestions: [
      'Try rephrasing your question',
      'Provide more specific details',
      'Contact support if the issue persists',
    ],
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format clarification request
 */
export const formatClarificationRequest = (missingFields) => {
  let message = 'I need a bit more information to help you better:\n\n';
  
  missingFields.forEach((field, index) => {
    message += `${index + 1}. ${field.question}\n`;
  });
  
  message += '\nPlease provide these details, and I\'ll create the perfect plan for you!';
  
  return {
    needsClarification: true,
    message,
    missingFields: missingFields.map(f => f.field),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format hotel recommendation response
 */
export const formatHotelResponse = (hotels, context) => {
  let response = `Here are the top hotels in **${context.destination}** matching your preferences:\n\n`;
  
  hotels.slice(0, 5).forEach((hotel, index) => {
    response += `**${index + 1}. ${hotel.name}** (${hotel.rating}⭐)\n`;
    response += `   📍 ${hotel.location} • ₹${hotel.price.toLocaleString()}/night\n`;
    response += `   ⭐ ${hotel.reviewScore}/10 (${hotel.reviewCount.toLocaleString()} reviews)\n`;
    response += `   ✨ ${hotel.matchReason}\n\n`;
  });
  
  response += 'Which hotel would you like to know more about?';
  
  return {
    conversationalResponse: response,
    hotels,
  };
};

/**
 * Format flight recommendation response
 */
export const formatFlightResponse = (flights, context) => {
  let response = `Here are the best flight options to **${context.destination}**:\n\n`;
  
  flights.forEach((flight, index) => {
    response += `**${index + 1}. ${flight.airline}** ${flight.flightNumber}\n`;
    response += `   🛫 ${flight.from} → ${flight.to}\n`;
    response += `   ⏰ ${flight.departure} - ${flight.arrival} (${flight.duration})\n`;
    response += `   💰 ₹${flight.price.toLocaleString()} • ${flight.stops === 0 ? 'Non-stop' : flight.stops + ' stop(s)'}\n`;
    response += `   ${flight.matchReason}\n\n`;
  });
  
  return {
    conversationalResponse: response,
    flights,
  };
};

/**
 * Format activity recommendation response
 */
export const formatActivityResponse = (activities, context) => {
  let response = `Exciting activities in **${context.destination}**:\n\n`;
  
  activities.forEach((activity, index) => {
    response += `**${index + 1}. ${activity.name}**\n`;
    response += `   ${activity.description}\n`;
    response += `   📍 ${activity.location} • ⏱️ ${activity.duration}\n`;
    response += `   💰 ₹${activity.price.toLocaleString()} • ⭐ ${activity.rating}/10\n`;
    response += `   ${activity.matchReason}\n\n`;
  });
  
  return {
    conversationalResponse: response,
    activities,
  };
};

/**
 * Format safety report response
 */
export const formatSafetyResponse = (safety, context) => {
  let response = `**Safety Information for ${context.destination}**\n\n`;
  
  response += `🛡️ **Overall Safety Score:** ${safety.overallScore}/10\n`;
  response += `${safety.assessment}\n\n`;
  
  if (safety.categories) {
    response += `**Category Scores:**\n`;
    response += `• Crime Safety: ${safety.categories.crime}/10\n`;
    response += `• Health: ${safety.categories.health}/10\n`;
    response += `• Women Safety: ${safety.categories.womenSafety}/10\n`;
    response += `• Solo Traveler: ${safety.categories.soloTraveler}/10\n\n`;
  }
  
  if (safety.warnings && safety.warnings.length > 0) {
    response += `**⚠️ Important Warnings:**\n`;
    safety.warnings.forEach(warning => {
      response += `• [${warning.severity.toUpperCase()}] ${warning.message}\n`;
    });
    response += '\n';
  }
  
  if (safety.emergencyContacts) {
    response += `**🚨 Emergency Contacts:**\n`;
    response += `• Police: ${safety.emergencyContacts.police}\n`;
    response += `• Ambulance: ${safety.emergencyContacts.ambulance}\n`;
    if (safety.emergencyContacts.touristPolice) {
      response += `• Tourist Police: ${safety.emergencyContacts.touristPolice}\n`;
    }
    response += '\n';
  }
  
  if (safety.tips) {
    response += `**💡 Safety Tips:**\n`;
    safety.tips.slice(0, 5).forEach(tip => {
      response += `• ${tip}\n`;
    });
  }
  
  return {
    conversationalResponse: response,
    safety,
  };
};

/**
 * Format booking confirmation response
 */
export const formatBookingConfirmation = (booking) => {
  let response = `✅ **Booking Confirmed!**\n\n`;
  
  response += `**Booking Reference:** ${booking.bookingReference}\n`;
  response += `**Type:** ${booking.bookingType.toUpperCase()}\n`;
  response += `**Amount:** ₹${booking.amount.toLocaleString()}\n`;
  response += `**Status:** ${booking.status}\n\n`;
  
  if (booking.bookingType === 'hotel' && booking.hotelDetails) {
    response += `**Hotel:** ${booking.hotelDetails.hotelName}\n`;
    response += `**Check-in:** ${new Date(booking.hotelDetails.checkIn).toLocaleDateString()}\n`;
    response += `**Check-out:** ${new Date(booking.hotelDetails.checkOut).toLocaleDateString()}\n`;
  } else if (booking.bookingType === 'flight' && booking.flightDetails) {
    response += `**Flight:** ${booking.flightDetails.airline} ${booking.flightDetails.flightNumber}\n`;
    response += `**From:** ${booking.flightDetails.departure.city}\n`;
    response += `**To:** ${booking.flightDetails.arrival.city}\n`;
  }
  
  response += `\nYou will receive a confirmation email shortly. Have a great trip! 🎉`;
  
  return {
    conversationalResponse: response,
    booking,
  };
};

/**
 * Format itinerary response
 */
export const formatItineraryResponse = (itinerary) => {
  let response = `📋 **Your ${itinerary.duration}-Day Itinerary for ${itinerary.destination}**\n\n`;
  
  response += `**Highlights:** ${itinerary.overview.highlights.join(', ')}\n`;
  response += `**Estimated Cost:** ₹${itinerary.overview.estimatedCost.toLocaleString()}\n\n`;
  
  itinerary.days.forEach(day => {
    response += `**${day.title}**\n`;
    
    day.schedule.forEach(item => {
      response += `  ${item.time} - ${item.title}\n`;
    });
    
    response += '\n';
  });
  
  response += 'Would you like to modify any day or add specific activities?';
  
  return {
    conversationalResponse: response,
    itinerary,
  };
};
