import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  modifyBooking,
} from '../controllers/booking.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createBookingSchema, cancelBookingSchema, modifyBookingSchema } from '../validators/booking.validator.js';

const router = express.Router();

// All booking routes require authentication
router.post('/create', authenticate, validate(createBookingSchema), createBooking);
router.get('/user', authenticate, getUserBookings);
router.get('/:id', authenticate, getBookingById);
router.post('/:id/cancel', authenticate, validate(cancelBookingSchema), cancelBooking);
router.put('/:id/modify', authenticate, validate(modifyBookingSchema), modifyBooking);

export default router;
