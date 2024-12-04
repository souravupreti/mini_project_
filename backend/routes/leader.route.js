// routes/leaderboard.routes.js
import express from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller.js';
import { authenticate } from '../middleware/isAuth.js';

const router = express.Router();

// Get the leaderboard
router.get('/', authenticate, getLeaderboard);

export default router;
