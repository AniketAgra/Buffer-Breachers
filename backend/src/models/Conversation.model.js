/**
 * CONVERSATION MODEL
 * 
 * Store conversation history for short-term and long-term memory
 */

import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  }],
  context: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  summary: {
    type: String,
  },
  importance: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
conversationSchema.index({ userId: 1, sessionId: 1 });
conversationSchema.index({ userId: 1, isActive: 1, lastAccessedAt: -1 });

// Update lastAccessedAt on every access
conversationSchema.pre('save', function(next) {
  this.lastAccessedAt = new Date();
  next();
});

export const Conversation = mongoose.model('Conversation', conversationSchema);
