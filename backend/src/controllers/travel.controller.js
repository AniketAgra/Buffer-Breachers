import { asyncHandler } from '../middlewares/error.middleware.js';
import { flights, hotels, activities, destinations } from '../utils/mockData.util.js';

/**
 * @desc    Search flights
 * @route   POST /api/travel/flights/search
 * @access  Public
 */
export const searchFlights = asyncHandler(async (req, res) => {
  const { to, from, date, travelers, class: flightClass } = req.body;
  
  let results = [...flights];
  
  // Filter by destination
  if (to) {
    results = results.filter(f => f.toCity.toLowerCase().includes(to.toLowerCase()));
  }
  
  // Filter by origin
  if (from) {
    results = results.filter(f => f.fromCity.toLowerCase().includes(from.toLowerCase()));
  }
  
  // Filter by class
  if (flightClass) {
    results = results.filter(f => f.class === flightClass);
  }
  
  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
});

/**
 * @desc    Search hotels
 * @route   POST /api/travel/hotels/search
 * @access  Public
 */
export const searchHotels = asyncHandler(async (req, res) => {
  const { destination, checkIn, checkOut, guests, rooms, priceRange, rating } = req.body;
  
  let results = [...hotels];
  
  // Filter by destination
  if (destination) {
    results = results.filter(h => h.destination.toLowerCase().includes(destination.toLowerCase()));
  }
  
  // Filter by price range
  if (priceRange) {
    if (priceRange.min) {
      results = results.filter(h => h.price >= priceRange.min);
    }
    if (priceRange.max) {
      results = results.filter(h => h.price <= priceRange.max);
    }
  }
  
  // Filter by rating
  if (rating) {
    results = results.filter(h => h.rating >= rating);
  }
  
  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
});

/**
 * @desc    Get all destinations
 * @route   GET /api/travel/destinations
 * @access  Public
 */
export const getDestinations = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: destinations.length,
    data: destinations,
  });
});

/**
 * @desc    Get destination details
 * @route   GET /api/travel/destinations/:id
 * @access  Public
 */
export const getDestinationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const destination = destinations.find(d => d.id === id || d.name.toLowerCase() === id.toLowerCase());
  
  if (!destination) {
    return res.status(404).json({
      success: false,
      message: 'Destination not found',
    });
  }
  
  res.status(200).json({
    success: true,
    data: destination,
  });
});

/**
 * @desc    Search activities
 * @route   POST /api/travel/activities/search
 * @access  Public
 */
export const searchActivities = asyncHandler(async (req, res) => {
  const { destination, date, category, priceRange } = req.body;
  
  let results = [...activities];
  
  // Filter by destination
  if (destination) {
    results = results.filter(a => a.destination.toLowerCase().includes(destination.toLowerCase()));
  }
  
  // Filter by category
  if (category) {
    results = results.filter(a => a.category === category);
  }
  
  // Filter by price range
  if (priceRange) {
    if (priceRange.min) {
      results = results.filter(a => a.price >= priceRange.min);
    }
    if (priceRange.max) {
      results = results.filter(a => a.price <= priceRange.max);
    }
  }
  
  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
});
