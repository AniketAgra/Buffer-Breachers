/**
 * ITINERARY BUILDER UTILITY
 * 
 * This module generates day-wise travel itineraries.
 * Uses intelligent scheduling and route optimization logic.
 */

import { activities, destinations } from './mockData.util.js';

/**
 * Build complete itinerary
 * @param {Object} context - User context
 * @param {Object} recommendations - Recommendations from engine
 * @returns {Object} - Day-wise itinerary
 */
export const buildItinerary = (context, recommendations) => {
  const duration = context.duration || 3;
  const destination = context.destination;
  
  if (!destination) {
    return null;
  }
  
  const itinerary = {
    destination,
    duration,
    days: [],
    overview: generateOverview(context, recommendations),
  };
  
  // Get selected hotel
  const selectedHotel = recommendations.hotels[0];
  
  // Get selected activities
  const selectedActivities = recommendations.activities.slice(0, duration * 2);
  
  // Build day-by-day plan
  for (let day = 1; day <= duration; day++) {
    const dayPlan = buildDayPlan(day, duration, destination, selectedHotel, selectedActivities, context);
    itinerary.days.push(dayPlan);
  }
  
  return itinerary;
};

/**
 * Build plan for a single day
 */
const buildDayPlan = (day, totalDays, destination, hotel, activities, context) => {
  const dayPlan = {
    day,
    title: generateDayTitle(day, totalDays, destination),
    date: calculateDate(day, context.dates?.startDate),
    schedule: [],
  };
  
  // Day 1: Arrival
  if (day === 1) {
    dayPlan.schedule = buildArrivalDay(destination, hotel, context);
  }
  // Last Day: Departure
  else if (day === totalDays) {
    dayPlan.schedule = buildDepartureDay(destination, hotel, context);
  }
  // Middle Days: Full exploration
  else {
    dayPlan.schedule = buildExplorationDay(destination, hotel, activities, day, context);
  }
  
  return dayPlan;
};

/**
 * Build arrival day schedule
 */
const buildArrivalDay = (destination, hotel, context) => {
  const schedule = [
    {
      time: '06:00',
      type: 'transport',
      title: 'Departure from Home',
      description: 'Leave for airport with buffer time for check-in',
      duration: '1h',
    },
    {
      time: '09:00',
      type: 'transport',
      title: 'Flight to ' + destination,
      description: 'Board your flight',
      duration: '3-6h',
    },
    {
      time: '14:00',
      type: 'checkin',
      title: 'Hotel Check-in',
      description: `Check-in at ${hotel?.name || 'hotel'}, freshen up and rest`,
      location: hotel?.location,
      duration: '2h',
    },
    {
      time: '16:00',
      type: 'leisure',
      title: 'Local Exploration',
      description: 'Explore nearby area, visit local markets or beach',
      duration: '3h',
    },
    {
      time: '19:00',
      type: 'meal',
      title: 'Dinner',
      description: 'Try local cuisine at a nearby restaurant',
      duration: '1.5h',
    },
    {
      time: '21:00',
      type: 'leisure',
      title: 'Rest & Relax',
      description: 'Early night to recover from travel',
      duration: '3h',
    },
  ];
  
  return schedule;
};

/**
 * Build exploration day schedule
 */
const buildExplorationDay = (destination, hotel, activities, day, context) => {
  // Select 2-3 activities for the day
  const startIdx = (day - 2) * 2;
  const dayActivities = activities.slice(startIdx, startIdx + 2);
  
  const schedule = [
    {
      time: '07:00',
      type: 'meal',
      title: 'Breakfast',
      description: 'Breakfast at hotel',
      location: hotel?.name,
      duration: '1h',
    },
  ];
  
  // Morning activity
  if (dayActivities[0]) {
    schedule.push({
      time: '09:00',
      type: 'activity',
      title: dayActivities[0].name,
      description: dayActivities[0].description,
      location: dayActivities[0].location,
      duration: dayActivities[0].duration,
      cost: dayActivities[0].price,
      category: dayActivities[0].category,
    });
  } else {
    schedule.push({
      time: '09:00',
      type: 'sightseeing',
      title: 'Local Sightseeing',
      description: `Explore popular landmarks in ${destination}`,
      duration: '3h',
    });
  }
  
  // Lunch
  schedule.push({
    time: '13:00',
    type: 'meal',
    title: 'Lunch',
    description: 'Lunch at local restaurant',
    duration: '1.5h',
  });
  
  // Afternoon activity
  if (dayActivities[1]) {
    schedule.push({
      time: '15:00',
      type: 'activity',
      title: dayActivities[1].name,
      description: dayActivities[1].description,
      location: dayActivities[1].location,
      duration: dayActivities[1].duration,
      cost: dayActivities[1].price,
      category: dayActivities[1].category,
    });
  } else {
    schedule.push({
      time: '15:00',
      type: 'leisure',
      title: 'Free Time',
      description: 'Shopping, spa, or relaxation at hotel',
      duration: '3h',
    });
  }
  
  // Evening
  schedule.push({
    time: '19:00',
    type: 'meal',
    title: 'Dinner',
    description: 'Dinner at recommended restaurant',
    duration: '2h',
  });
  
  schedule.push({
    time: '21:00',
    type: 'leisure',
    title: 'Evening Leisure',
    description: 'Explore nightlife or relax at hotel',
    duration: '2h',
  });
  
  return schedule;
};

/**
 * Build departure day schedule
 */
const buildDepartureDay = (destination, hotel, context) => {
  const schedule = [
    {
      time: '07:00',
      type: 'meal',
      title: 'Breakfast',
      description: 'Final breakfast at hotel',
      location: hotel?.name,
      duration: '1h',
    },
    {
      time: '08:00',
      type: 'leisure',
      title: 'Last-minute Shopping',
      description: 'Buy souvenirs and local specialties',
      duration: '2h',
    },
    {
      time: '10:00',
      type: 'checkout',
      title: 'Hotel Check-out',
      description: 'Check out from hotel',
      location: hotel?.name,
      duration: '1h',
    },
    {
      time: '11:00',
      type: 'transport',
      title: 'Transfer to Airport',
      description: 'Cab to airport',
      duration: '1h',
    },
    {
      time: '13:00',
      type: 'transport',
      title: 'Return Flight',
      description: 'Flight back home',
      duration: '3-6h',
    },
    {
      time: '18:00',
      type: 'transport',
      title: 'Arrival Home',
      description: 'Reach home with wonderful memories!',
      duration: '1h',
    },
  ];
  
  return schedule;
};

/**
 * Generate day title
 */
const generateDayTitle = (day, totalDays, destination) => {
  if (day === 1) {
    return `Day 1: Arrival in ${destination}`;
  } else if (day === totalDays) {
    return `Day ${day}: Departure`;
  } else {
    return `Day ${day}: Exploring ${destination}`;
  }
};

/**
 * Calculate date for day
 */
const calculateDate = (day, startDate) => {
  if (!startDate) {
    return null;
  }
  
  const date = new Date(startDate);
  date.setDate(date.getDate() + (day - 1));
  return date.toISOString().split('T')[0];
};

/**
 * Generate itinerary overview
 */
const generateOverview = (context, recommendations) => {
  const overview = {
    destination: context.destination,
    duration: context.duration,
    travelType: context.travel.type,
    highlights: [],
    estimatedCost: 0,
  };
  
  // Extract highlights from recommendations
  if (recommendations.activities.length > 0) {
    overview.highlights = recommendations.activities
      .slice(0, 3)
      .map(a => a.name);
  }
  
  // Calculate estimated cost
  if (recommendations.hotels[0]) {
    overview.estimatedCost += recommendations.hotels[0].price * (context.duration - 1);
  }
  if (recommendations.flights[0]) {
    overview.estimatedCost += recommendations.flights[0].price * 2; // Round trip
  }
  if (recommendations.activities.length > 0) {
    const activityCost = recommendations.activities
      .slice(0, 4)
      .reduce((sum, a) => sum + a.price, 0);
    overview.estimatedCost += activityCost;
  }
  
  return overview;
};

/**
 * Export itinerary as text format
 */
export const formatItineraryAsText = (itinerary) => {
  let text = `ITINERARY FOR ${itinerary.destination.toUpperCase()}\n`;
  text += `Duration: ${itinerary.duration} days\n\n`;
  text += `OVERVIEW:\n`;
  text += `Highlights: ${itinerary.overview.highlights.join(', ')}\n`;
  text += `Estimated Cost: ₹${itinerary.overview.estimatedCost.toLocaleString()}\n\n`;
  text += `═══════════════════════════════════════\n\n`;
  
  for (const day of itinerary.days) {
    text += `${day.title}\n`;
    if (day.date) {
      text += `Date: ${day.date}\n`;
    }
    text += `\n`;
    
    for (const item of day.schedule) {
      text += `  ${item.time} - ${item.title}\n`;
      text += `  ${item.description}\n`;
      if (item.location) {
        text += `  Location: ${item.location}\n`;
      }
      text += `\n`;
    }
    
    text += `───────────────────────────────────────\n\n`;
  }
  
  return text;
};

/**
 * Validate itinerary for conflicts
 */
export const validateItinerary = (itinerary) => {
  const issues = [];
  
  for (const day of itinerary.days) {
    let previousEndTime = null;
    
    for (const item of day.schedule) {
      // Check for time overlaps
      if (previousEndTime) {
        const currentStart = parseTime(item.time);
        if (currentStart < previousEndTime) {
          issues.push({
            day: day.day,
            issue: 'Time overlap detected',
            item: item.title,
          });
        }
      }
      
      // Calculate end time
      const duration = parseDuration(item.duration);
      previousEndTime = parseTime(item.time) + duration;
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Parse time string to minutes
 */
const parseTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Parse duration to minutes
 */
const parseDuration = (duration) => {
  if (!duration) return 60; // Default 1 hour
  
  const match = duration.match(/(\d+(\.\d+)?)\s*h/);
  if (match) {
    return parseFloat(match[1]) * 60;
  }
  return 60;
};
