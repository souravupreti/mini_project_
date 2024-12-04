import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        index: true // Indexing for faster querying by name
    },
    specialization: { 
        type: String, 
        required: true,
        trim: true
    },
    amount:{
        type:Number,
        required:true,
    },
    experience: { 
        type: Number, 
        required: true, 
        min: 0 // Ensure experience is a positive number
    },
    availability: { 
        days: [{ 
            type: String, 
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
        }],
        timeSlots: [{ 
            start: { type: String, required: true }, // e.g., "09:00"
            end: { type: String, required: true } // e.g., "17:00"
        }]
    },
    bio: { 
        type: String,
        maxlength: 500,
        trim: true
    },
    profileImage: { 
        type: String,
        default: "default-profile.jpg" // Default image if none provided
    },
    contactInfo: {
        email: { 
            type: String, 
            required: true, 
            match: /.+\@.+\..+/, // Basic email regex validation
            unique: true // Ensure email uniqueness
        },
        phone: { 
            type: String,
            match: /^\+?[1-9]\d{1,14}$/ // Adjusted regex for international phone numbers
        }
    },
    ratings: {
        averageRating: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 5
        },
        reviews: [{
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            rating: { 
                type: Number, 
                required: true, 
                min: 1, 
                max: 5 
            },
            comment: { 
                type: String, 
                maxlength: 300,
                trim: true
            },
            createdAt: { 
                type: Date, 
                default: Date.now 
            }
        }]
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Middleware to update the average rating
trainerSchema.pre('save', function (next) {
    if (this.ratings.reviews.length > 0) {
        const total = this.ratings.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.ratings.averageRating = (total / this.ratings.reviews.length).toFixed(1);
    } else {
        this.ratings.averageRating = 0; // Set average rating to 0 if no reviews
    }
    this.updatedAt = Date.now();
    next();
});

// Indexes
trainerSchema.index({ specialization: 1, experience: -1 });

export default mongoose.model('Trainer', trainerSchema);
