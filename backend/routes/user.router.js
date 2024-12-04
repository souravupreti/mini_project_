import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    sendPasswordResetMail,
    resetPassword,
    updateUserProfile,
    getUserDetails
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/isAuth.js';

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// User Logout
router.post('/logout', authenticate, logoutUser);

// Forgot Password
router.post('/forgot-password', sendPasswordResetMail);

// Reset Password
router.post('/reset-password/:token', resetPassword);

// Update User Profile (requires authentication)
router.put('/profile', authenticate, updateUserProfile);
// Get User Details (requires authentication)
router.get('/details', authenticate, getUserDetails);




export default router;
