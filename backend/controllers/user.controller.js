
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendPasswordMail } from '../utils/forgetMail.js';
import cloudinary from "../middleware/cloud.js"


// Register new user
export const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('username profilePicture');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};
export const registerUser = async (req, res) => {
  const { username, email, password, role = 'user' } = req.body; // Default role to 'user'

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role, // Save the user role
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const currentDate = new Date();
    const lastLoginDate = user.lastLogin ? new Date(user.lastLogin) : null;
    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day

    // Check if last login was today, if not, update streak and lastLogin
    if (lastLoginDate) {
      const isSameDay = currentDate.getDate() === lastLoginDate.getDate() &&
                        currentDate.getMonth() === lastLoginDate.getMonth() &&
                        currentDate.getFullYear() === lastLoginDate.getFullYear();

      if (!isSameDay) {
        // Not the same day, reset the streak or increment if previous login was yesterday
        if (currentDate - lastLoginDate <= oneDay) {
          user.streakCount += 1; // Increment streak
        } else {
          user.streakCount = 1; // Reset streak
        }
      }
    } else {
      user.streakCount = 1; // New user or no prior login, start the streak
    }

    // Set last login date to current date only once per day
    user.lastLogin = currentDate;

    // Save the updated user data
    await user.save();

    // Create a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // // Set the cookie with the token
    // res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000,  sameSite: 'strict'  }); // Cookie expires in 1 day
    res.cookie('userId', user._id.toString(), { httpOnly: true,secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 ,sameSite: 'strict'}); // User ID cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set true if HTTPS
      sameSite: 'None', // Required for cross-origin requests
      maxAge: 3600000, // 1 hour
    });
  
    // Respond with the user details and streak
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
      streak: user.streakCount,
      last_login:user.lastLogin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Logout user


// Forgot password
export const sendPasswordResetMail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    await sendPasswordMail(user);
    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { username, preferences } = req.body;
    const userId = req.user.id;
    const updates = {};

    // Handle text-based updates
    if (username) updates.username = username;
    if (preferences) updates.preferences = preferences;

    // Handle profile picture upload if file is present
    if (req.files && req.files.profilePicture) {
      const file = req.files.profilePicture;

      // Validate file type
      if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Please upload an image file' });
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'Image size should be less than 5MB' });
      }

      try {
        // Get current user to check for existing profile picture
        const currentUser = await User.findById(userId);
        
        // Delete old profile picture from Cloudinary if it exists
        if (currentUser.profilePicture) {
          const publicId = currentUser.profilePicture.split('/').pop().split('.')[0];
          try {
            await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue with upload even if delete fails
          }
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'profile_pictures',
          width: 400,
          height: 400,
          crop: 'fill',
          quality: 'auto',
          fetch_format: 'auto',
          resource_type: 'image'
        });

        updates.profilePicture = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Error uploading profile picture' });
      }
    } else if (req.body.profilePicture) {
      // If profilePicture is provided as a URL (e.g., from external upload)
      updates.profilePicture = req.body.profilePicture;
    }

    // Update user profile with all changes
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user details
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

