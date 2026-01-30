import { z } from 'zod';

// Create booking validation schema
export const createBookingSchema = z.object({
  tripId: z.string().optional(),
  bookingType: z.enum(['flight', 'hotel', 'activity', 'transfer', 'package']),
  flightDetails: z
    .object({
      flightNumber: z.string(),
      airline: z.string(),
      departure: z.object({
        airport: z.string(),
        city: z.string(),
        dateTime: z.string(),
      }),
      arrival: z.object({
        airport: z.string(),
        city: z.string(),
        dateTime: z.string(),
      }),
      class: z.string(),
      passengers: z.number(),
    })
    .optional(),
  hotelDetails: z
    .object({
      hotelName: z.string(),
      hotelId: z.string(),
      location: z.string(),
      checkIn: z.string(),
      checkOut: z.string(),
      roomType: z.string(),
      numberOfRooms: z.number(),
      guests: z.number(),
    })
    .optional(),
  activityDetails: z
    .object({
      activityName: z.string(),
      activityId: z.string(),
      location: z.string(),
      date: z.string(),
      time: z.string(),
      participants: z.number(),
    })
    .optional(),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['credit-card', 'debit-card', 'upi', 'net-banking', 'wallet']),
  contactDetails: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  specialRequests: z.string().optional(),
});

// Cancel booking validation schema
export const cancelBookingSchema = z.object({
  reason: z.string().min(10, 'Please provide a reason for cancellation'),
});

// Modify booking validation schema
export const modifyBookingSchema = z.object({
  modifications: z.object({
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    guests: z.number().optional(),
    specialRequests: z.string().optional(),
  }),
});
