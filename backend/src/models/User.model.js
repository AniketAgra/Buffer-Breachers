import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Don't include password by default in queries
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['CLIENT', 'AGENT'],
      default: 'CLIENT',
    },
    // Agent-specific fields
    agentDetails: {
      license: String,
      specialization: [String], // e.g., ['luxury', 'adventure', 'family']
      clients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
    },
    preferences: {
      budget: {
        type: String,
        enum: ['budget', 'mid-range', 'luxury'],
        default: 'mid-range',
      },
      travelStyle: {
        type: String,
        enum: ['solo', 'family', 'couple', 'friends', 'business'],
        default: 'solo',
      },
      accommodation: {
        type: String,
        enum: ['hostel', 'hotel', 'resort', 'apartment', 'any'],
        default: 'hotel',
      },
      transportation: {
        type: String,
        enum: ['economy', 'premium-economy', 'business', 'first-class'],
        default: 'economy',
      },
      mealPreference: {
        type: String,
        enum: ['veg', 'non-veg', 'vegan', 'no-preference'],
        default: 'no-preference',
      },
    },
    avatar: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model('User', userSchema);
