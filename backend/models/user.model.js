import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    targetDate: { type: Date },
    status: { type: String, default: "not started" }, // New field for tracking status
    createdAt: { type: Date, default: Date.now }, // Tracking creation date
    updatedAt: { type: Date, default: Date.now }, // Tracking last update
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, 
    coins: { type: Number, default: 0 },
    streakCount: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    profilePicture: { type: String, default: '' },
    achievements: [
      {
        challengeId: mongoose.Schema.Types.ObjectId,
        name: String,
        rewardCoins: Number,
        completionDate: Date,
      },
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    role: { type: String, enum: ['user', 'trainer','admin'], default: 'user' },
    trainerPurchased: { type: Boolean, default: false },
    trainerDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
    joinedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
    lastLogin: { type: Date,
      default: null
    },
    completedChallenges: [
      {
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
        completedAt: { type: Date, default: Date.now },
        reward: { type: Number }
      }
    ],
    upcomingChallenges: [
      {
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
        notifyAt: { type: Date, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    personalGoals: [goalSchema], // Use nested schema for goals
    preferences: {
      notifications: { type: Boolean, default: true },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' }
    },
    // isVerified: { type: Boolean, default: false } // For email verification
  },
  { timestamps: true } 
);

export default mongoose.model("User", userSchema);
