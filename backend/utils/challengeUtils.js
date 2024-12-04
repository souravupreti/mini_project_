import cron from "node-cron";
import Challenge from "../models/challenges.model.js"; // Update the path as needed
import User from "../models/user.model.js"; // Update the path as needed

export const completeChallenges = async () => {
  try {
    const currentDate = new Date();

    // Find challenges that need completion
    const challengesToComplete = await Challenge.find({
      status: { $ne: "completed" },
      endDate: { $lt: currentDate },
    });

    for (const challenge of challengesToComplete) {
      challenge.status = "completed"; // Mark challenge as completed

      // Update the participants' status to 'completed'
      for (const participant of challenge.participants) {
        if (participant.dailyStreak >= challenge.duration) {
          participant.hasCompletedChallenge = true; // Participant has completed the challenge
          participant.joined = false; // Mark participant as no longer joined after challenge completion

          // Award coins to the participant
          participant.coinsEarned = challenge.rewardCoins;

          // Update the participant's coins and achievements
          const user = await User.findById(participant.userId);
          if (user) {
            // Award coins to the user
            user.coins = (user.coins || 0) + challenge.rewardCoins;

            // Log the achievement for the user
            user.achievements.push({
              challengeId: challenge._id,
              name: challenge.name,
              rewardCoins: challenge.rewardCoins,
              completionDate: currentDate,
            });

            // Add to the completedChallenges array
            user.completedChallenges.push({
              challengeId: challenge._id,
              completedAt: currentDate,
              reward: challenge.rewardCoins,
            });

            // Remove from the joinedChallenges array (if needed)
            user.joinedChallenges = user.joinedChallenges.filter(
              (joinedChallengeId) => !joinedChallengeId.equals(challenge._id)
            );

            await user.save(); // Save user data after awarding coins and updating challenges
          }
        }
      }

      await challenge.save(); // Save challenge after completion
    }

    console.log("Challenge completion job ran successfully");
  } catch (error) {
    console.error("Error completing challenges:", error);
  }
};

// Schedule the function to run at 6:29 PM every day
cron.schedule("41 20 * * *", completeChallenges);
