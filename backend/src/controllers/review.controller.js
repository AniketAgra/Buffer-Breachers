import { asyncHandler } from '../middlewares/error.middleware.js';
import { Review } from '../models/Review.model.js';

/**
 * @desc    Create review
 * @route   POST /api/review
 * @access  Private
 */
export const createReview = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const reviewData = req.body;
  
  const review = await Review.create({
    userId,
    ...reviewData,
  });
  
  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: review,
  });
});

/**
 * @desc    Get reviews for entity
 * @route   GET /api/review/:entityId
 * @access  Public
 */
export const getReviewsByEntity = asyncHandler(async (req, res) => {
  const { entityId } = req.params;
  const { entityType } = req.query;
  
  const query = { entityId };
  if (entityType) {
    query.entityType = entityType;
  }
  
  const reviews = await Review.find(query)
    .populate('userId', 'name avatar')
    .sort({ createdAt: -1 });
  
  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  
  res.status(200).json({
    success: true,
    count: reviews.length,
    averageRating: parseFloat(avgRating),
    data: reviews,
  });
});

/**
 * @desc    Get user reviews
 * @route   GET /api/review/user
 * @access  Private
 */
export const getUserReviews = asyncHandler(async (req, res) => {
  const userId = req.userId;
  
  const reviews = await Review.find({ userId }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

/**
 * @desc    Mark review as helpful
 * @route   POST /api/review/:id/helpful
 * @access  Public
 */
export const markHelpful = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { helpful } = req.body; // true or false
  
  const review = await Review.findById(id);
  
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }
  
  if (helpful) {
    review.helpful += 1;
  } else {
    review.notHelpful += 1;
  }
  
  await review.save();
  
  res.status(200).json({
    success: true,
    message: 'Feedback recorded',
    data: review,
  });
});
