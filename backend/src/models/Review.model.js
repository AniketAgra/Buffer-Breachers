import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    entityType: {
      type: String,
      enum: ['hotel', 'flight', 'activity', 'destination', 'transfer', 'restaurant'],
      required: true,
    },
    entityId: {
      type: String,
      required: true,
    },
    entityName: {
      type: String,
      required: true,
      trim: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    pros: [
      {
        type: String,
        trim: true,
      },
    ],
    cons: [
      {
        type: String,
        trim: true,
      },
    ],
    photos: [
      {
        type: String,
      },
    ],
    // Detailed ratings (optional)
    detailedRatings: {
      cleanliness: Number,
      service: Number,
      valueForMoney: Number,
      location: Number,
      comfort: Number,
      facilities: Number,
    },
    travelType: {
      type: String,
      enum: ['solo', 'family', 'couple', 'friends', 'business'],
    },
    tripDate: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    notHelpful: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    moderationNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
reviewSchema.index({ entityType: 1, entityId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: 1 });

// Virtual for average rating calculation
reviewSchema.virtual('averageRating').get(function () {
  if (!this.detailedRatings) return this.rating;
  
  const ratings = Object.values(this.detailedRatings).filter(r => r);
  if (ratings.length === 0) return this.rating;
  
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return (sum / ratings.length).toFixed(1);
});

export const Review = mongoose.model('Review', reviewSchema);
