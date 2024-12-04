import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  caption: { 
    type: String, 
    maxlength: 300, 
    trim: true // Remove leading/trailing spaces
  },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }, 
  mediaUrl: [{ 
    type: String, 
    required: true 
  }],
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  mediaType: { 
    type: String, 
    enum: ['photo'], // Added support for video posts
    required: true 
  },
  comments: [
    {
      userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      },
      text: { 
        type: String, 
        required: true, 
        trim: true // Remove leading/trailing spaces
      },
      timestamp: { 
        type: Date, 
        default: Date.now 
      }
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now // Track when the post is updated
  }
});

// Middleware to update the `updatedAt` field
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Post', postSchema);
