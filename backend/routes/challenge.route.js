// routes/challenge.routes.js
import express from 'express';
import {
    createChallenge,
    joinChallenge,
    getChallenges,
    getChallengeById,
    increase,
} from '../controllers/challenges.controller.js';
import { getChallengeLeaderboard } from '../controllers/leaderboard.controller.js';
import {authenticate} from '../middleware/isAuth.js';

const routers = express.Router();

// Create a new challenge - only admin or users with streak > 100
routers.post('/create', authenticate, createChallenge);

// Join a challenge
routers.post('/:challengeId/join', authenticate, joinChallenge);

// Get all challenges
routers.get('/', authenticate, getChallenges);

// Get specific challenge details
routers.get('/:challengeId', authenticate, getChallengeById);
routers.post('/:id/upload',authenticate,increase);
// routers.get('/:challengeId/leaderboard', authenticate, getChallengeLeaderboard);

export default routers;
