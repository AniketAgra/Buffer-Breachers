import express from 'express';
import { createReview, getReviewsByEntity, getUserReviews, markHelpful } from '../controllers/review.controller.js';
import { authenticate, optionalAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createReviewSchema } from '../validators/review.validator.js';

const router = express.Router();

// Public routes
router.get('/:entityId', getReviewsByEntity);
router.post('/:id/helpful', markHelpful);

// Protected routes
router.post('/', authenticate, validate(createReviewSchema), createReview);
router.get('/user/me', authenticate, getUserReviews);

export default router;
