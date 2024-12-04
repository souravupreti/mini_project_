import express from 'express';
import {
  followUser,
  unfollowUser,
  viewFollowing,
  viewFollowers
} from '../controllers/following.controller.js';
import { getUserProfile } from '../controllers/user.controller.js';
import { createPost, getPostsByFollowing } from '../controllers/post.controller.js';

const routerss = express.Router();

// Create a new post
routerss.post('/post', createPost);

// Get posts by the users the current user is following
routerss.get('/user/:userId/posts', getPostsByFollowing);

// Follow a user
routerss.post('/user/follow', followUser);

// Unfollow a user
routerss.post('/user/:userId/unfollow', unfollowUser);

// Get a list of users that the current user is following
routerss.get('/user/:userId/following', viewFollowing);

// Get a list of followers of the current user
routerss.get('/user/:userId/followers', viewFollowers);

// Get user profile information
routerss.get('/user/:userId', getUserProfile);

export default routerss;
