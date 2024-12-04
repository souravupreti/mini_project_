import Challenge from "../models/challenges.model.js";
import User from "../models/user.model.js";
import cloudinary from "../middleware/cloud.js"
import mongoose from "mongoose";
import Post from "../models/post.model.js";

// Function to create a new challenge
// Controller to handle challenge creation
export const createChallenge = async (req, res) => {
  try {
    const userId = req.user?._id; // Use optional chaining in case req.user is undefined

    // Check if userId is present
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId);

    // Check if user was found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is allowed to create challenges
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can create challenges" });
    }

    const { name, description, rewardCoins, streakRequired, duration, challengeMedia, status, startDate, endDate } = req.body;

    // Check if all required fields are provided
    if (!name || !description || !rewardCoins || !streakRequired || !duration || !status || !startDate || !endDate) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Ensure startDate is before endDate
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "Start date must be before end date" });
    }

    // Ensure the duration is a positive number
    if (duration <= 0) {
      return res.status(400).json({ message: "Duration must be a positive number" });
    }

    // Ensure rewardCoins and streakRequired are positive numbers
    if (rewardCoins <= 0 || streakRequired < 0) {
      return res.status(400).json({ message: "Reward coins and streak required must be positive numbers" });
    }

    // Handle challenge media (if provided)

    const challenge = new Challenge({
      name,
      description,
      rewardCoins,
      streakRequired,
      duration,
      challengeMedia:challengeMedia,
      status,
      startDate,
      endDate,
    });

    await challenge.save();
    res.status(201).json({ message: "Challenge created successfully", challenge });
  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({ message: "Server Error", error: error.message || error });
  }
};




export const getChallenges = async (req, res) => {
  try {
      const challenges = await Challenge.find();
      res.status(200).json(challenges);
  } catch (error) {
      console.error("Error retrieving challenges:", error);
      res.status(500).json({ message: "Failed to retrieve challenges", error });
  }
};

// Get a specific challenge by ID
// Get a specific challenge by ID and show the photos uploaded by participants
export const getChallengeById = async (req, res) => {
  try {
    const { challengeId } = req.params;

    // Validate if challengeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(challengeId)) {
      console.error('Invalid Challenge ID:', challengeId);
      return res.status(400).json({ message: 'Invalid challenge ID' });
    }

    console.log('Fetching challenge with ID:', challengeId);

    // Find the challenge by its ID and populate the participants' user details
    const challenge = await Challenge.findById(challengeId)
      .populate('participants.userId', 'username profilePicture photoUrl');  // Populate userId in participants

    if (!challenge) {
      console.log('Challenge not found:', challengeId);
      return res.status(404).json({ message: 'Challenge not found' });
    }

    console.log('Challenge found:', challenge);

    // Map the participants to get their username and photoUrl
    const participantPhotos = challenge.participants.map(participant => ({
      username: participant.userId.username, // Access the populated userId data
      photoUrl: participant.userId.photoUrl || '/default-photo.png' // Use a fallback URL if no photo is provided
    }));

    // Send the challenge details along with the participants' photos
    res.status(200).json({
      challenge: {
        name: challenge.name,
        description: challenge.description,
        rewardCoins: challenge.rewardCoins,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        status: challenge.status,
        participants: participantPhotos,  // Include the participants' photo URLs
      },
    });
  } catch (error) {
    console.error('Error retrieving challenge:', error);
    res.status(500).json({ message: 'Failed to retrieve challenge', error: error.message });
  }
};

// Update a challenge
export const updateChallenge = async (req, res) => {
  try {
      const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!challenge) return res.status(404).json({ message: "Challenge not found" });
      res.status(200).json({ message: "Challenge updated successfully", challenge });
  } catch (error) {
      console.error("Error updating challenge:", error);
      res.status(500).json({ message: "Failed to update challenge", error });
  }
};

// Delete a challenge
export const deleteChallenge = async (req, res) => {
  try {
      const challenge = await Challenge.findByIdAndDelete(req.params.id);
      if (!challenge) return res.status(404).json({ message: "Challenge not found" });
      res.status(200).json({ message: "Challenge deleted successfully" });
  } catch (error) {
      console.error("Error deleting challenge:", error);
      res.status(500).json({ message: "Failed to delete challenge", error });
  }
};

// Join a challenge
// Join a challenge
export const joinChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;

    // Fetch the challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Check if the challenge is active
    const currentDate = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Invalid start or end date for the challenge" });
    }

    // if (currentDate.toDateString() !== startDate.toDateString()) {
    //   return res.status(400).json({ message: "Challenge can only be joined on its start date" });
    // }

    if (currentDate > endDate) {
      return res.status(400).json({ message: "Cannot join a challenge that has already ended" });
    }

    // Fetch the user
    const user = await User.findById(userId);

    // Check if the user's streak meets the challenge's requirements
    if (user.streakCount < challenge.streakRequired) {
      return res.status(403).json({ message: "Your streak is too low to join this challenge" });
    }

    // Check if the user has already joined the challenge
    if (challenge.participants.some(participant => participant.userId.equals(userId))) {
      return res.status(400).json({ message: "You have already joined this challenge" });
    }

    // Add the user to the challenge participants
    challenge.participants.push({
      userId: userId,  // Correctly add the userId
      dailyStreak: 0,
      lastUpload: null,
      hasCompletedChallenge: false,
      coinsEarned: 0,
    });
    await challenge.save();

    // Add challenge to the user's joinedChallenges
    await User.findByIdAndUpdate(userId, {
      $addToSet: { joinedChallenges: challengeId },
    });

    res.status(200).json({ message: "Successfully joined the challenge" });
  } catch (error) {
    console.error("Error joining challenge:", error);
    res.status(500).json({ message: "Failed to join challenge", error });
  }
};


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const increase = async (req, res) => {
  const challengeId = req.params.id;
  const userId = req.user._id; // Authenticated user ID
  const { photo} = req.body; // Accept photo and optional caption

  try {
    // Validate challenge ID
    if (!mongoose.Types.ObjectId.isValid(challengeId)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    // Fetch the challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Ensure the challenge is active
    const currentDate = new Date();
    if (challenge.status !== "active" || currentDate < new Date(challenge.startDate)) {
      return res.status(400).json({ message: "Challenge is not active" });
    }

    // Find the participant using userId
    const userEntry = challenge.participants.find((p) =>
      p.userId.equals(userId) // Use userId for matching
    );
    if (!userEntry) {
      return res.status(400).json({ message: "User is not a participant in this challenge" });
    }

    // Ensure photo is uploaded only once per day
    const lastUploadDate = userEntry.lastUpload ? new Date(userEntry.lastUpload) : null;
    if (lastUploadDate && currentDate.toDateString() === lastUploadDate.toDateString()) {
      return res.status(400).json({ message: "Photo already uploaded for today" });
    }

    // Validate photo input
    if (!photo) {
      return res.status(400).json({ message: "Photo is required for upload" });
    }

    // Upload the photo to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(photo, {
      folder: "fitness-challenges",
      public_id: `challenge_${challengeId}_photo_${userId}_${Date.now()}`,
    });

    // Update participant details
    userEntry.dailyStreak = (userEntry.dailyStreak || 0) + 1;
    userEntry.lastUpload = currentDate;

    // Check if the user has completed the challenge
    const challengeEndDate = new Date(challenge.endDate);
    if (currentDate >= challengeEndDate && userEntry.dailyStreak >= challenge.duration) {
      userEntry.hasCompletedChallenge = true;
      userEntry.coinsEarned = challenge.rewardCoins;

      // Award coins to the user
      const user = await User.findById(userId);
      if (user) {
        user.coins = (user.coins || 0) + challenge.rewardCoins;

        // Log the achievement
        user.completedChallenges.push({
          challengeId: challenge._id,
          completedAt: currentDate,
          reward: challenge.rewardCoins,
        });

        await user.save();
      }
    }

    // Automatically mark the challenge as completed if past the end date
    if (currentDate >= challengeEndDate && challenge.status !== "completed") {
      challenge.status = "completed";
    }

    // Save the updated challenge
    await challenge.save();

    // Create a new post for the photo
    const newPost = new Post({
      userId,
      caption:'hello',
      challengeId,
      mediaUrl: [uploadResult.secure_url],
      mediaType: "photo",
    });
    await newPost.save();

    // Add the post to the user's posts array
    const user = await User.findById(userId);
    if (user) {
      user.posts.push(newPost._id);
      await user.save();
    }

    // Send response
    res.status(200).json({
      message: "Photo uploaded successfully, streak updated",
      photoUrl: uploadResult.secure_url,
      coinsAwarded: userEntry.hasCompletedChallenge ? challenge.rewardCoins : 0,
      postId: newPost._id,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ message: "Failed to upload photo", error: error.message || error });
  }
};
