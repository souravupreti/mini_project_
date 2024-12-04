import cloudinary from 'cloudinary';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a new post
export const createPost = async (req, res) => {
  const { content, image } = req.body;

  try {
    let imageUrl = null;
    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: 'posts',
      });
      imageUrl = cloudinaryResponse.secure_url; // Store the image URL
    }

    const newPost = new Post({
      content,
      image: imageUrl,
      userId: req.user._id, // Assuming user ID is set via middleware
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

// Get posts from users the current user is following
export const getPostsByFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate the userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid User ID:", userId);
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Fetch the user and populate their 'following' list
    const user = await User.findById(userId).populate('following', '_id');
    console.log("Fetched User:", user);

    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Extract following user IDs
    const followingUserIds = user.following.map(f => f._id);
    console.log("Following User IDs:", followingUserIds);

    // Fetch posts created by the users in the following list
    const posts = await Post.find({ userId: { $in: followingUserIds } })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 });
    console.log("Fetched Posts:", posts);

    // Return the posts
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by following:", error);
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};
