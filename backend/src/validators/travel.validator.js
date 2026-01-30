import { z } from 'zod';

// Flight search validation schema
export const flightSearchSchema = z.object({
  from: z.string().min(2, 'From location required'),
  to: z.string().min(2, 'To location required'),
  date: z.string().optional(),
  travelers: z.number().min(1).max(9).optional(),
  class: z.enum(['Economy', 'Premium Economy', 'Business', 'First Class']).optional(),
});

// Hotel search validation schema
export const hotelSearchSchema = z.object({
  destination: z.string().min(2, 'Destination required'),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().min(1).max(10).optional(),
  rooms: z.number().min(1).max(5).optional(),
  priceRange: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  rating: z.number().min(1).max(5).optional(),
});

// Activity search validation schema
export const activitySearchSchema = z.object({
  destination: z.string().min(2, 'Destination required'),
  date: z.string().optional(),
  category: z.enum(['sightseeing', 'adventure', 'cultural', 'shopping', 'dining', 'relaxation', 'other']).optional(),
  priceRange: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
});
