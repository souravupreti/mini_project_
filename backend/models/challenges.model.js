import mongoose from "mongoose";
import User from "./user.model.js";
const challengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  rewardCoins: {
    type: Number,
    required: true,
    min: 0
  },
  streakRequired: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  challengeMedia: {
    type: String,
    trim: true,
    default: '/default-media.jpg'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'upcoming'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dailyStreak: { type: Number, default: 0 },
    lastUpload: Date,
    hasCompletedChallenge: { type: Boolean, default: false },
    coinsEarned: { type: Number, default: 0 }
  }],
}, { 
  timestamps: true // Automatically adds `createdAt` and `updatedAt`
});

// Virtual Field
challengeSchema.virtual('remainingDays').get(function() {
  const currentDate = new Date();
  return Math.max(0, Math.ceil((this.endDate - currentDate) / (1000 * 60 * 60 * 24)));
});

// Middleware to prevent duplicate participants
challengeSchema.pre('save', function(next) {
  const uniqueParticipants = new Set(this.participants.map(p => p.userId.toString()));
  if (uniqueParticipants.size !== this.participants.length) {
    return next(new Error("Duplicate participants are not allowed."));
  }
  next();
});

// Middleware to validate dates
challengeSchema.pre('validate', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after the start date.'));
  }
  next();
});

// Indexes for Performance
challengeSchema.index({ startDate: 1 });
challengeSchema.index({ status: 1 });

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;