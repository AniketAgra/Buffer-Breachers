import { z } from 'zod';

// Copilot query validation schema
export const copilotQuerySchema = z.object({
  message: z.string().min(3, 'Message must be at least 3 characters').max(1000, 'Message too long'),
  sessionId: z.string().optional(),
  context: z
    .object({
      previousIntent: z.string().optional(),
      conversationHistory: z.array(z.any()).optional(),
    })
    .optional(),
});

// Refine query validation schema
export const refineQuerySchema = z.object({
  recommendationId: z.string().min(1, 'Recommendation ID is required'),
  refinements: z.object({
    priceRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    hotelRating: z.number().min(1).max(5).optional(),
    flightClass: z.enum(['Economy', 'Premium Economy', 'Business', 'First Class']).optional(),
    activityTypes: z.array(z.string()).optional(),
  }),
});
