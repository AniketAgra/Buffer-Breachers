import { z } from 'zod';

// Register validation schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
  phone: z.string().optional(),
  preferences: z
    .object({
      budget: z.enum(['budget', 'mid-range', 'luxury']).optional(),
      travelStyle: z.enum(['solo', 'family', 'couple', 'friends', 'business']).optional(),
      accommodation: z.enum(['hostel', 'hotel', 'resort', 'apartment', 'any']).optional(),
      transportation: z.enum(['economy', 'premium-economy', 'business', 'first-class']).optional(),
      mealPreference: z.enum(['veg', 'non-veg', 'vegan', 'no-preference']).optional(),
    })
    .optional(),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Update profile validation schema
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long').optional(),
  phone: z.string().optional(),
  preferences: z
    .object({
      budget: z.enum(['budget', 'mid-range', 'luxury']).optional(),
      travelStyle: z.enum(['solo', 'family', 'couple', 'friends', 'business']).optional(),
      accommodation: z.enum(['hostel', 'hotel', 'resort', 'apartment', 'any']).optional(),
      transportation: z.enum(['economy', 'premium-economy', 'business', 'first-class']).optional(),
      mealPreference: z.enum(['veg', 'non-veg', 'vegan', 'no-preference']).optional(),
    })
    .optional(),
});
