import User from '../models/user.model.js';

// Follow a user
export const followUser = async (req, res) => {
  const { userId, targetUsername } = req.body;

  // Validate input
  if (!userId || !targetUsername) {
    return res.status(400).json({ success: false, message: 'User ID and Target Username are required' });
  }

  try {
    const targetUserId = await User.findOne({ username: targetUsername }).select('_id');
    console.log('Target User:', targetUserId);
    
    if (!targetUserId) {
      return res.status(404).json({ success: false, message: 'Target user not found' });
    }

    if (userId === targetUserId.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    const [user, target] = await Promise.all([
      User.findById(userId),
      User.findById(targetUserId),
    ]);

    if (!user || !target) {
      return res.status(404).json({ success: false, message: 'One or both users not found' });
    }

    if (user.following.includes(targetUserId)) {
      return res.status(400).json({ success: false, message: 'Already following this user' });
    }

    user.following.push(targetUserId);
    target.followers.push(userId);

    await Promise.all([user.save(), target.save()]);

    res.status(200).json({
      success: true,
      message: 'User followed successfully',
      data: { following: user.following, followers: target.followers },
    });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  const { userId, targetUserId } = req.body;

  if (!userId || !targetUserId) {
    return res.status(400).json({ message: 'User ID and Target User ID are required' });
  }

  try {
    // Find the users by their IDs
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is actually following the target user
    if (!user.following.includes(targetUserId)) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    // Remove the target user from the current user's following list
    user.following = user.following.filter(following => following.toString() !== targetUserId.toString());
    await user.save();

    // Remove the current user from the target user's followers list
    targetUser.followers = targetUser.followers.filter(follower => follower.toString() !== userId.toString());
    await targetUser.save();

    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error });
  }
};

// View the list of people a user is following
export const viewFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('following', 'username profilePicture'); // Populate only relevant fields
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.following); // Return the list of following users
  } catch (error) {
    res.status(500).json({ message: 'Error fetching following list', error });
  }
};

// View the list of followers of a user
export const viewFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('followers', 'username profilePicture'); // Populate only relevant fields
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.followers); // Return the list of followers
  } catch (error) {
    res.status(500).json({ message: 'Error fetching followers list', error });
  }
};
