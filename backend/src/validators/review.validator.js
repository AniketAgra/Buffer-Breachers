import { z } from 'zod';

// Review creation validation schema
export const createReviewSchema = z.object({
  entityType: z.enum(['hotel', 'flight', 'activity', 'destination', 'transfer', 'restaurant']),
  entityId: z.string().min(1, 'Entity ID is required'),
  entityName: z.string().min(1, 'Entity name is required'),
  bookingId: z.string().optional(),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title: z.string().max(100, 'Title too long').optional(),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment too long'),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  detailedRatings: z
    .object({
      cleanliness: z.number().min(1).max(5).optional(),
      service: z.number().min(1).max(5).optional(),
      valueForMoney: z.number().min(1).max(5).optional(),
      location: z.number().min(1).max(5).optional(),
      comfort: z.number().min(1).max(5).optional(),
      facilities: z.number().min(1).max(5).optional(),
    })
    .optional(),
  travelType: z.enum(['solo', 'family', 'couple', 'friends', 'business']).optional(),
  tripDate: z.string().optional(),
});
