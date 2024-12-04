import Trainer from '../models/trainer.model.js';

// Create a new trainer
export const createTrainer = async (req, res) => {
    const { name, specialization, experience, availability, bio, profileImage, contactInfo ,amount} = req.body;

    try {
        const newTrainer = await Trainer.create({ name, specialization, experience, availability, bio, profileImage, contactInfo ,amount});
        res.status(201).json(newTrainer);
    } catch (error) {
        res.status(400).json({ message: "Error creating trainer", error });
    }
};

// Get all trainers
export const getTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.status(200).json(trainers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching trainers", error });
    }
};

// Update trainer details
export const updateTrainer = async (req, res) => {
    const { id } = req.params;
    const { name, specialization, experience, availability, bio, profileImage, contactInfo } = req.body;

    try {
        const updatedTrainer = await Trainer.findByIdAndUpdate(id, { name, specialization, experience, availability, bio, profileImage, contactInfo,amount }, { new: true });
        res.status(200).json(updatedTrainer);
    } catch (error) {
        res.status(400).json({ message: "Error updating trainer", error });
    }
};

// Delete a trainer
export const deleteTrainer = async (req, res) => {
    const { id } = req.params;

    try {
        await Trainer.findByIdAndDelete(id);
        res.status(200).json({ message: "Trainer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting trainer", error });
    }
};
import User from '../models/user.model.js';

export const buyTrainerService = async (req, res) => {
    const { userId } = req.body;  // User's ID is still sent in the request body
    const { id: trainerId } = req.params;  // Trainer's ID comes from the route parameter

    try {
        // Validate the presence of userId
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);
        const trainer = await Trainer.findById(trainerId);

        if (!user || !trainer) {
            return res.status(404).json({ message: 'User or Trainer not found' });
        }

        const originalPrice = trainer.amount;  // Assuming trainer price is stored
        let discount = 0;

        // Apply 10% discount if the user has enough coins
        if (user.coins >= 0.1 * originalPrice) {
            discount = 0.1 * originalPrice;
            user.coins -= discount; // Deduct coins for the discount
        }

        const finalPrice = originalPrice - discount;

        // If the user doesn't have enough coins
        if (user.coins < 0) {
            return res.status(400).json({ message: 'Not enough coins for the discount' });
        }

        // Proceed with the purchase
        user.trainerPurchased = true; // Mark the user as having purchased the trainer service
        await user.save();

        // Send a response with the purchase details
        res.status(200).json({
            message: `Trainer purchased successfully! Final Price: ${finalPrice}`,
            finalPrice,
            trainer,
            user: {
                id: user._id,
                name: user.name,
                coins: user.coins,
                trainerPurchased: user.trainerPurchased
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing purchase', error });
    }
};
