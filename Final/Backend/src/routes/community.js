import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createCommunity,
  joinCommunity,
  getJoinedCommunities,
  getCommunityById,
  updateCommunity,
  leaveCommunity,
  deleteCommunity,
  promoteMember,
  demoteMember,
  removeMember,
  searchCommunities
} from '../controllers/communityController.js';

const router = express.Router();

// =======================================
// PUBLIC ROUTES (for testing)
// =======================================

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Community routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Community service is healthy',
    timestamp: new Date().toISOString()
  });
});

// =======================================
// PROTECTED ROUTES (require authentication)
// =======================================

// Create a new community
router.post('/create', protect, createCommunity);

// Join community by code
router.post('/join', protect, joinCommunity);

// Get all communities user has joined
router.get('/joined', protect, getJoinedCommunities);

// Search communities
router.get('/search', protect, searchCommunities);

// Get specific community details
router.get('/:id', protect, getCommunityById);

// Update community settings (admin only)
router.put('/:id', protect, updateCommunity);

// Leave community
router.delete('/:id/leave', protect, leaveCommunity);

// Delete community (creator only)
router.delete('/:id', protect, deleteCommunity);

// Promote member to admin
router.put('/:id/promote/:memberId', protect, promoteMember);

// Demote admin to member
router.put('/:id/demote/:memberId', protect, demoteMember);

// Remove member from community
router.delete('/:id/members/:memberId', protect, removeMember);

// =======================================
// EXPORT
// =======================================
export default router;
