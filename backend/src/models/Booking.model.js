import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
    },
    bookingType: {
      type: String,
      enum: ['flight', 'hotel', 'activity', 'transfer', 'package'],
      required: true,
    },
    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },
    // Flight-specific details
    flightDetails: {
      flightNumber: String,
      airline: String,
      departure: {
        airport: String,
        city: String,
        dateTime: Date,
      },
      arrival: {
        airport: String,
        city: String,
        dateTime: Date,
      },
      class: String,
      passengers: Number,
    },
    // Hotel-specific details
    hotelDetails: {
      hotelName: String,
      hotelId: String,
      location: String,
      checkIn: Date,
      checkOut: Date,
      roomType: String,
      numberOfRooms: Number,
      guests: Number,
      amenities: [String],
    },
    // Activity-specific details
    activityDetails: {
      activityName: String,
      activityId: String,
      location: String,
      date: Date,
      time: String,
      duration: String,
      participants: Number,
      description: String,
    },
    // Transfer-specific details
    transferDetails: {
      type: String, // cab, bus, train
      from: String,
      to: String,
      date: Date,
      time: String,
      vehicleType: String,
      passengers: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
      default: 'pending',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially-refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['credit-card', 'debit-card', 'upi', 'net-banking', 'wallet'],
    },
    paymentDate: {
      type: Date,
    },
    cancellationPolicy: {
      refundable: {
        type: Boolean,
        default: true,
      },
      cancellationFee: {
        type: Number,
        default: 0,
      },
      cancellationDeadline: {
        type: Date,
      },
      policyText: String,
    },
    cancellationDetails: {
      cancelledAt: Date,
      reason: String,
      refundAmount: Number,
      refundStatus: String,
      refundDate: Date,
    },
    contactDetails: {
      name: String,
      email: String,
      phone: String,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    bookingNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate booking reference before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingReference = `TBO${this.bookingType.substring(0, 2).toUpperCase()}${timestamp}${random}`;
  }
  next();
});

export const Booking = mongoose.model('Booking', bookingSchema);
