import { asyncHandler } from '../middlewares/error.middleware.js';
import { Booking } from '../models/Booking.model.js';
import { calculateRefund } from '../utils/pricingEngine.util.js';

/**
 * @desc    Create new booking
 * @route   POST /api/booking/create
 * @access  Private
 */
export const createBooking = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const bookingData = req.body;
  
  const booking = await Booking.create({
    userId,
    ...bookingData,
    status: 'pending',
    paymentStatus: 'pending',
  });
  
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking,
  });
});

/**
 * @desc    Get user bookings
 * @route   GET /api/booking/user
 * @access  Private
 */
export const getUserBookings = asyncHandler(async (req, res) => {
  const userId = req.userId;
  
  const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

/**
 * @desc    Get booking by ID
 * @route   GET /api/booking/:id
 * @access  Private
 */
export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  
  const booking = await Booking.findOne({ _id: id, userId });
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }
  
  res.status(200).json({
    success: true,
    data: booking,
  });
});

/**
 * @desc    Cancel booking
 * @route   POST /api/booking/:id/cancel
 * @access  Private
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const userId = req.userId;
  
  const booking = await Booking.findOne({ _id: id, userId });
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }
  
  if (booking.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      message: 'Booking is already cancelled',
    });
  }
  
  // Calculate refund
  const checkInDate = booking.hotelDetails?.checkIn || booking.flightDetails?.departure?.dateTime;
  const daysBeforeCheckIn = checkInDate ? Math.floor((new Date(checkInDate) - new Date()) / (1000 * 60 * 60 * 24)) : 30;
  
  const refundInfo = calculateRefund(
    booking.amount,
    booking.cancellationPolicy,
    daysBeforeCheckIn
  );
  
  // Update booking
  booking.status = 'cancelled';
  booking.cancellationDetails = {
    cancelledAt: new Date(),
    reason,
    refundAmount: refundInfo.refundAmount,
    refundStatus: 'pending',
  };
  
  await booking.save();
  
  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      booking,
      refundInfo,
    },
  });
});

/**
 * @desc    Modify booking
 * @route   PUT /api/booking/:id/modify
 * @access  Private
 */
export const modifyBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { modifications } = req.body;
  const userId = req.userId;
  
  const booking = await Booking.findOne({ _id: id, userId });
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }
  
  if (booking.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      message: 'Cannot modify cancelled booking',
    });
  }
  
  // Apply modifications
  if (modifications.checkIn && booking.hotelDetails) {
    booking.hotelDetails.checkIn = modifications.checkIn;
  }
  
  if (modifications.checkOut && booking.hotelDetails) {
    booking.hotelDetails.checkOut = modifications.checkOut;
  }
  
  if (modifications.guests && booking.hotelDetails) {
    booking.hotelDetails.guests = modifications.guests;
  }
  
  if (modifications.specialRequests) {
    booking.specialRequests = modifications.specialRequests;
  }
  
  await booking.save();
  
  res.status(200).json({
    success: true,
    message: 'Booking modified successfully',
    data: booking,
  });
});
