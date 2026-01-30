/**
 * INTENT PARSER UTILITY
 * 
 * This module simulates NLP by extracting user intent and entities from natural language queries.
 * Uses keyword matching, regex patterns, and rule-based logic (NO ML).
 * 
 * Main Functions:
 * - parseIntent: Classifies user intent
 * - extractEntities: Extracts destination, budget, dates, preferences
 * - buildContext: Creates structured context for decision engine
 */

// Intent categories with keyword mappings
const INTENT_KEYWORDS = {
  TRIP_PLANNING: ['plan', 'trip', 'vacation', 'tour', 'visit', 'travel', 'holiday', 'getaway', 'itinerary', 'schedule'],
  FLIGHT_SEARCH: ['flight', 'fly', 'airline', 'departure', 'plane', 'air', 'ticket'],
  HOTEL_SEARCH: ['hotel', 'stay', 'accommodation', 'resort', 'lodge', 'room', 'book hotel'],
  SAFETY_INQUIRY: ['safe', 'secure', 'risk', 'danger', 'warning', 'safety', 'crime', 'threat'],
  BOOKING: ['book', 'reserve', 'confirm', 'payment', 'purchase', 'buy'],
  CANCELLATION: ['cancel', 'refund', 'change', 'modify', 'reschedule'],
  RECOMMENDATION: ['suggest', 'recommend', 'best', 'top', 'popular', 'good', 'advise'],
  ACTIVITY_SEARCH: ['activity', 'things to do', 'attractions', 'sightseeing', 'adventure', 'explore'],
  BUDGET_INQUIRY: ['cost', 'price', 'budget', 'expensive', 'cheap', 'afford'],
  GENERAL_INFO: ['tell', 'about', 'information', 'know', 'learn', 'explain', 'what is'],
};

// Travel type keywords
const TRAVEL_TYPE_KEYWORDS = {
  solo: ['solo', 'alone', 'myself', 'individual', 'single'],
  family: ['family', 'kids', 'children', 'parents', 'relatives'],
  couple: ['couple', 'romantic', 'honeymoon', 'partner', 'spouse', 'girlfriend', 'boyfriend'],
  friends: ['friends', 'group', 'buddies', 'mates'],
  business: ['business', 'work', 'conference', 'meeting', 'corporate'],
};

// Budget preference keywords
const BUDGET_KEYWORDS = {
  budget: ['budget', 'cheap', 'affordable', 'economical', 'low cost', 'inexpensive'],
  'mid-range': ['mid-range', 'moderate', 'reasonable', 'average'],
  luxury: ['luxury', 'premium', 'deluxe', 'high-end', 'upscale', '5-star', 'luxurious'],
};

/**
 * Main intent parser function
 * @param {string} message - User's query
 * @returns {Object} - Parsed intent and confidence score
 */
export const parseIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  const tokens = lowerMessage.split(/\s+/);
  
  const scores = {};
  
  // Calculate scores for each intent
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    scores[intent] = 0;
    
    for (const keyword of keywords) {
      // Exact word match
      if (tokens.includes(keyword)) {
        scores[intent] += 2;
      }
      // Partial match
      if (lowerMessage.includes(keyword)) {
        scores[intent] += 1;
      }
    }
  }
  
  // Find the intent with highest score
  let primaryIntent = 'GENERAL_INFO';
  let maxScore = 0;
  
  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      primaryIntent = intent;
    }
  }
  
  // If no clear intent, default to TRIP_PLANNING for travel-related queries
  if (maxScore === 0) {
    primaryIntent = 'TRIP_PLANNING';
  }
  
  return {
    primary: primaryIntent,
    confidence: Math.min(maxScore / 5, 1), // Normalize to 0-1
    allScores: scores,
  };
};

/**
 * Extract destination from message
 * @param {string} message - User's query
 * @returns {string|null} - Extracted destination
 */
export const extractDestination = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Common destination names (you can expand this)
  const destinations = [
    'dubai', 'goa', 'paris', 'singapore', 'maldives', 'bangkok', 'manali', 
    'jaipur', 'mumbai', 'delhi', 'london', 'new york', 'tokyo', 'bali',
    'kerala', 'kashmir', 'ladakh', 'rajasthan', 'himachal', 'uttarakhand',
    'andaman', 'lakshadweep', 'pondicherry', 'udaipur', 'jodhpur', 'varanasi'
  ];
  
  for (const dest of destinations) {
    if (lowerMessage.includes(dest)) {
      // Capitalize first letter
      return dest.charAt(0).toUpperCase() + dest.slice(1);
    }
  }
  
  return null;
};

/**
 * Extract budget from message
 * @param {string} message - User's query
 * @returns {Object} - Budget amount and preference
 */
export const extractBudget = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Extract numeric budget (Indian format)
  const patterns = [
    /(\d+)\s*lakh/i,
    /₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/,
    /rs\.?\s*(\d+(?:,\d+)*)/i,
    /inr\s*(\d+(?:,\d+)*)/i,
    /(\d+)\s*(?:k|thousand)/i,
  ];
  
  let amount = null;
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      let value = match[1].replace(/,/g, '');
      
      if (message.toLowerCase().includes('lakh')) {
        amount = parseFloat(value) * 100000;
      } else if (message.toLowerCase().includes('k') || message.toLowerCase().includes('thousand')) {
        amount = parseFloat(value) * 1000;
      } else {
        amount = parseFloat(value);
      }
      break;
    }
  }
  
  // Determine budget category
  let preference = 'mid-range';
  
  for (const [category, keywords] of Object.entries(BUDGET_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        preference = category;
        break;
      }
    }
  }
  
  // Infer preference from amount if specified
  if (amount !== null) {
    if (amount < 20000) {
      preference = 'budget';
    } else if (amount > 100000) {
      preference = 'luxury';
    }
  }
  
  return { amount, preference };
};

/**
 * Extract duration from message
 * @param {string} message - User's query
 * @returns {number|null} - Duration in days
 */
export const extractDuration = (message) => {
  // Pattern matching for duration
  const patterns = [
    /(\d+)\s*(?:day|days)/i,
    /(\d+)\s*(?:night|nights)/i,
    /(\d+)d/i,
    /(\d+)n/i,
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      let days = parseInt(match[1]);
      
      // If nights mentioned, add 1 day
      if (message.toLowerCase().includes('night')) {
        days += 1;
      }
      
      return days;
    }
  }
  
  // Check for week/month
  if (/(\d+)\s*week/i.test(message)) {
    const weeks = parseInt(message.match(/(\d+)\s*week/i)[1]);
    return weeks * 7;
  }
  
  if (/(\d+)\s*month/i.test(message)) {
    const months = parseInt(message.match(/(\d+)\s*month/i)[1]);
    return months * 30;
  }
  
  return null;
};

/**
 * Extract travel type from message
 * @param {string} message - User's query
 * @returns {string} - Travel type
 */
export const extractTravelType = (message) => {
  const lowerMessage = message.toLowerCase();
  
  for (const [type, keywords] of Object.entries(TRAVEL_TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return type;
      }
    }
  }
  
  return 'solo'; // Default
};

/**
 * Extract number of travelers
 * @param {string} message - User's query
 * @returns {number} - Number of travelers
 */
export const extractTravelerCount = (message) => {
  const patterns = [
    /(\d+)\s*(?:people|person|persons|traveler|travelers|pax)/i,
    /for\s*(\d+)/i,
    /group of\s*(\d+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  // Infer from travel type
  const travelType = extractTravelType(message);
  const typeToCount = {
    solo: 1,
    couple: 2,
    family: 4,
    friends: 4,
    business: 1,
  };
  
  return typeToCount[travelType] || 1;
};

/**
 * Extract preferences from message
 * @param {string} message - User's query
 * @returns {Object} - Extracted preferences
 */
export const extractPreferences = (message) => {
  const lowerMessage = message.toLowerCase();
  
  const preferences = {
    accommodation: null,
    transportation: null,
    activities: [],
  };
  
  // Accommodation preferences
  if (/5[-\s]star|luxury|resort|premium/i.test(lowerMessage)) {
    preferences.accommodation = 'resort';
  } else if (/3[-\s]star|hotel|standard/i.test(lowerMessage)) {
    preferences.accommodation = 'hotel';
  } else if (/budget|hostel|cheap/i.test(lowerMessage)) {
    preferences.accommodation = 'hostel';
  }
  
  // Transportation preferences
  if (/business\s*class|first\s*class/i.test(lowerMessage)) {
    preferences.transportation = 'business';
  } else if (/economy/i.test(lowerMessage)) {
    preferences.transportation = 'economy';
  }
  
  // Activity preferences
  const activityKeywords = {
    adventure: ['adventure', 'trekking', 'hiking', 'sports', 'thrill'],
    cultural: ['culture', 'heritage', 'museum', 'temple', 'historic'],
    relaxation: ['relax', 'spa', 'beach', 'peaceful', 'calm'],
    shopping: ['shopping', 'mall', 'market', 'bazaar'],
    nightlife: ['nightlife', 'party', 'club', 'bar'],
    sightseeing: ['sightseeing', 'tourist', 'attractions', 'monuments'],
  };
  
  for (const [activity, keywords] of Object.entries(activityKeywords)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        preferences.activities.push(activity);
        break;
      }
    }
  }
  
  return preferences;
};

/**
 * Extract dates from message (basic date extraction)
 * @param {string} message - User's query
 * @returns {Object} - Start and end dates
 */
export const extractDates = (message) => {
  const lowerMessage = message.toLowerCase();
  const dates = {
    startDate: null,
    endDate: null,
    flexible: false,
  };
  
  // Check for flexibility keywords
  if (/flexible|anytime|whenever/i.test(lowerMessage)) {
    dates.flexible = true;
  }
  
  // Month matching
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                  'july', 'august', 'september', 'october', 'november', 'december',
                  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  
  for (const month of months) {
    if (lowerMessage.includes(month)) {
      // Rough date estimation (just set to next occurrence of that month)
      // In production, you'd use a proper date parser
      dates.startDate = `${month} 2026`;
      break;
    }
  }
  
  return dates;
};

/**
 * Main entity extraction function
 * @param {string} message - User's query
 * @returns {Object} - All extracted entities
 */
export const extractEntities = (message) => {
  return {
    destination: extractDestination(message),
    budget: extractBudget(message),
    duration: extractDuration(message),
    travelType: extractTravelType(message),
    travelerCount: extractTravelerCount(message),
    preferences: extractPreferences(message),
    dates: extractDates(message),
  };
};

/**
 * Build complete context from message
 * @param {string} message - User's query
 * @param {Object} userProfile - User profile from database
 * @returns {Object} - Complete context object
 */
export const buildContext = (message, userProfile = null) => {
  const intent = parseIntent(message);
  const entities = extractEntities(message);
  
  // Merge with user profile preferences
  const context = {
    query: {
      original: message,
      intent: intent.primary,
      confidence: intent.confidence,
    },
    destination: entities.destination,
    budget: {
      amount: entities.budget.amount,
      preference: entities.budget.preference,
    },
    duration: entities.duration,
    travel: {
      type: entities.travelType,
      count: entities.travelerCount,
    },
    preferences: entities.preferences,
    dates: entities.dates,
    user: userProfile ? {
      savedPreferences: userProfile.preferences,
      pastTrips: userProfile.pastTrips || [],
    } : null,
  };
  
  return context;
};

/**
 * Detect if query needs clarification
 * @param {Object} context - Built context object
 * @returns {Object} - Clarification needed status and questions
 */
export const needsClarification = (context) => {
  const missing = [];
  
  if (!context.destination) {
    missing.push({
      field: 'destination',
      question: 'Which destination are you interested in?',
    });
  }
  
  if (!context.duration) {
    missing.push({
      field: 'duration',
      question: 'How many days are you planning to travel?',
    });
  }
  
  if (!context.budget.amount && !context.budget.preference) {
    missing.push({
      field: 'budget',
      question: 'What is your approximate budget for this trip?',
    });
  }
  
  return {
    needsClarification: missing.length > 0,
    missingFields: missing,
  };
};
