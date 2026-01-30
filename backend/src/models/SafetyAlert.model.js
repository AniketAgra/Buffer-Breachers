import mongoose from 'mongoose';

const safetyAlertSchema = new mongoose.Schema(
  {
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
    alertType: {
      type: String,
      enum: ['health', 'security', 'weather', 'political', 'natural-disaster', 'terrorism', 'civil-unrest', 'general'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
      default: 'medium',
    },
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Alert message is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    recommendations: [
      {
        type: String,
        trim: true,
      },
    ],
    affectedAreas: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
    },
    source: {
      type: String,
      trim: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      riskLevel: Number, // 1-10 scale
      emergencyContacts: [
        {
          type: String,
          label: String,
          number: String,
        },
      ],
      relatedLinks: [
        {
          title: String,
          url: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
safetyAlertSchema.index({ destination: 1, isActive: 1 });
safetyAlertSchema.index({ validUntil: 1 });

// Method to check if alert is still valid
safetyAlertSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (!this.validUntil) return true;
  return new Date() < this.validUntil;
};

export const SafetyAlert = mongoose.model('SafetyAlert', safetyAlertSchema);
