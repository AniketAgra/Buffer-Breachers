import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    destinationCity: {
      type: String,
      trim: true,
    },
    destinationCountry: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    duration: {
      type: Number, // in days
      required: true,
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
    },
    travelType: {
      type: String,
      enum: ['solo', 'family', 'couple', 'friends', 'business'],
      default: 'solo',
    },
    numberOfTravelers: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['planning', 'booked', 'ongoing', 'completed', 'cancelled'],
      default: 'planning',
    },
    itinerary: [
      {
        day: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        activities: [
          {
            name: String,
            description: String,
            time: String,
            location: String,
            cost: Number,
            duration: String,
            category: {
              type: String,
              enum: ['sightseeing', 'adventure', 'cultural', 'shopping', 'dining', 'relaxation', 'other'],
            },
          },
        ],
        accommodation: {
          hotelId: String,
          hotelName: String,
          checkIn: String,
          checkOut: String,
          roomType: String,
          cost: Number,
        },
        transportation: [
          {
            type: {
              type: String,
              enum: ['flight', 'train', 'bus', 'taxi', 'rental', 'metro', 'other'],
            },
            from: String,
            to: String,
            time: String,
            cost: Number,
            details: String,
          },
        ],
        meals: [
          {
            type: {
              type: String,
              enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
            },
            location: String,
            cost: Number,
          },
        ],
      },
    ],
    totalCost: {
      type: Number,
      default: 0,
    },
    costBreakdown: {
      flights: { type: Number, default: 0 },
      accommodation: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      meals: { type: Number, default: 0 },
      transportation: { type: Number, default: 0 },
      miscellaneous: { type: Number, default: 0 },
    },
    notes: {
      type: String,
      trim: true,
    },
    aiGeneratedInsights: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate duration before saving
tripSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end day
  }
  next();
});

export const Trip = mongoose.model('Trip', tripSchema);
