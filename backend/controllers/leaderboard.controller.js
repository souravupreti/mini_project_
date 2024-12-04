import User from '../models/user.model.js';
import Challenge from '../models/challenges.model.js'; // Import the Challenge model if needed

// Get the leaderboard for a specific challenge based on challenge-specific streaks
export const getChallengeLeaderboard = async (req, res) => {
    const { challengeId } = req.params; // Expecting the challenge ID from the request params

    try {
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        const users = await User.find({ completedChallenges: { $elemMatch: { challengeId } } })
            .select('username streakCount profilePicture completedChallenges');

        const leaderboardWithStreaks = users.map(user => {
            const completedChallengesCount = user.completedChallenges.filter(ch => ch.challengeId.toString() === challengeId).length;
            return {
                username: user.username,
                streakCount: completedChallengesCount, // This can be adjusted to reflect actual streak count logic
                profilePicture: user.profilePicture
            };
        });

        res.status(200).json({ message: 'Leaderboard fetched successfully', leaderboard: leaderboardWithStreaks });
    } catch (error) {
        console.error("Error fetching challenge leaderboard:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
