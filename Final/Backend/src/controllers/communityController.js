import Community from '../models/Community.js';
import User from '../models/User.js';

// =======================================
// @desc    Create new community
// @route   POST /api/communities/create
// @access  Private
// =======================================
export const createCommunity = async (req, res) => {
  try {
    const { name, description, settings } = req.body;
    const userId = req.user._id || req.user.id;

    console.log('🔍 Creating community:', { name, userId });

    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Community name is required'
      });
    }

    if (name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Community name must be at least 3 characters'
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Community name cannot exceed 100 characters'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has complete profile (optional - only if hasCompleteProfile method exists)
    if (user.hasCompleteProfile && !user.hasCompleteProfile()) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile before creating a community'
      });
    }

    // Generate unique 4-digit code
    const code = await Community.generateUniqueCode();
    console.log('✅ Generated code:', code);

    // Create community
    const community = await Community.create({
      name: name.trim(),
      description: description?.trim() || '',
      code,
      createdBy: userId,
      members: [{
        user: userId,
        role: 'admin',
        joinedAt: new Date()
      }],
      settings: {
        isPublic: settings?.isPublic || false,
        maxMembers: settings?.maxMembers || 100,
        allowMemberInvite: settings?.allowMemberInvite !== false,
        autoApprove: settings?.autoApprove !== false
      },
      isActive: true,
      lastActivity: new Date()
    });

    // Populate creator info
    await community.populate('createdBy', 'name email username avatar picture');

    console.log('✅ Community created:', {
      id: community._id,
      name: community.name,
      code: community.code,
      creator: user.email
    });

    res.status(201).json({
      success: true,
      message: 'Community created successfully',
      community: {
        id: community._id,
        _id: community._id,
        name: community.name,
        description: community.description,
        code: community.code,
        members: community.members.length,
        isAdmin: true,
        createdBy: community.createdBy,
        createdAt: community.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Create community error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating community',
      error: error.message
    });
  }
};

// =======================================
// @desc    Join community by code
// @route   POST /api/communities/join
// @access  Private
// =======================================
export const joinCommunity = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id || req.user.id;

    console.log('🔍 Joining community:', { code, userId });

    // Validate code
    if (!code || code.length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'Invalid community code. Code must be 4 digits.'
      });
    }

    if (!/^\d{4}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: 'Community code must contain only numbers'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has complete profile (optional)
    if (user.hasCompleteProfile && !user.hasCompleteProfile()) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile before joining a community'
      });
    }

    // Find community by code (case-insensitive)
    const community = await Community.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found. Please check the code and try again.'
      });
    }

    // Check if already a member
    if (community.isMember(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this community'
      });
    }

    // Check max members limit
    if (community.members.length >= community.settings.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Community has reached maximum members limit'
      });
    }

    // Add user to community
    community.members.push({
      user: userId,
      role: 'member',
      joinedAt: new Date()
    });

    community.lastActivity = new Date();
    await community.save();

    console.log('✅ User joined community:', {
      user: user.email,
      community: community.name,
      code: community.code
    });

    res.status(200).json({
      success: true,
      message: `Successfully joined ${community.name}!`,
      community: {
        id: community._id,
        _id: community._id,
        name: community.name,
        description: community.description,
        code: community.code,
        members: community.members.length,
        isAdmin: false
      }
    });
  } catch (error) {
    console.error('❌ Join community error:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining community',
      error: error.message
    });
  }
};

// =======================================
// @desc    Get all joined communities
// @route   GET /api/communities/joined
// @access  Private
// =======================================
export const getJoinedCommunities = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    console.log('🔍 Fetching communities for user:', userId);

    // Find all communities where user is a member
    const communities = await Community.find({
      'members.user': userId,
      isActive: true
    })
    .populate('createdBy', 'name email username avatar picture')
    .sort({ lastActivity: -1 });

    console.log('✅ Found', communities.length, 'communities');

    // Format communities data
    const formattedCommunities = communities.map(community => {
      const member = community.members.find(
        m => m.user.toString() === userId.toString()
      );

      return {
        id: community._id,
        _id: community._id,
        name: community.name,
        description: community.description,
        code: community.code,
        members: community.members.length,
        isAdmin: member?.role === 'admin',
        isCreator: community.createdBy._id.toString() === userId.toString(),
        createdBy: {
          id: community.createdBy._id,
          name: community.createdBy.name,
          email: community.createdBy.email,
          avatar: community.createdBy.avatar || community.createdBy.picture
        },
        joinedAt: member?.joinedAt,
        createdAt: community.createdAt,
        lastActivity: community.lastActivity
      };
    });

    res.status(200).json({
      success: true,
      count: formattedCommunities.length,
      communities: formattedCommunities
    });
  } catch (error) {
    console.error('❌ Get communities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching communities',
      error: error.message
    });
  }
};

// =======================================
// @desc    Get community by ID
// @route   GET /api/communities/:id
// @access  Private
// =======================================
export const getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    console.log('🔍 Fetching community:', { id, userId });

    // Find community with populated data
    const community = await Community.findById(id)
      .populate('createdBy', 'name email username avatar picture bio')
      .populate('members.user', 'name email username avatar picture bio');

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is a member
    if (!community.isMember(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this community.'
      });
    }

    // Format member data
    const formattedMembers = community.members.map(member => ({
      id: member.user._id,
      name: member.user.name,
      username: member.user.username,
      email: member.user.email,
      avatar: member.user.avatar || member.user.picture,
      bio: member.user.bio,
      role: member.role,
      joinedAt: member.joinedAt
    }));

    const member = community.members.find(
      m => m.user._id.toString() === userId.toString()
    );

    console.log('✅ Community fetched:', community.name);

    res.status(200).json({
      success: true,
      community: {
        id: community._id,
        _id: community._id,
        name: community.name,
        description: community.description,
        code: community.code,
        createdBy: {
          id: community.createdBy._id,
          name: community.createdBy.name,
          username: community.createdBy.username,
          email: community.createdBy.email,
          avatar: community.createdBy.avatar || community.createdBy.picture,
          bio: community.createdBy.bio
        },
        members: formattedMembers,
        memberCount: community.members.length,
        isAdmin: member?.role === 'admin',
        isCreator: community.createdBy._id.toString() === userId.toString(),
        settings: community.settings,
        garden: community.garden,
        isActive: community.isActive,
        createdAt: community.createdAt,
        updatedAt: community.updatedAt,
        lastActivity: community.lastActivity
      }
    });
  } catch (error) {
    console.error('❌ Get community error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching community details',
      error: error.message
    });
  }
};

// =======================================
// @desc    Update community
// @route   PUT /api/communities/:id
// @access  Private (Admin only)
// =======================================
export const updateCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    const { name, description, settings } = req.body;

    console.log('🔍 Updating community:', { id, userId });

    // Find community
    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is admin
    if (!community.isAdmin(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only community admins can update settings.'
      });
    }

    // Update fields
    if (name && name.trim().length > 0) {
      if (name.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Community name must be at least 3 characters'
        });
      }
      community.name = name.trim();
    }

    if (description !== undefined) {
      community.description = description.trim();
    }

    if (settings) {
      community.settings = { 
        ...community.settings.toObject(), 
        ...settings 
      };
    }

    community.lastActivity = new Date();
    await community.save();

    console.log('✅ Community updated:', {
      id: community._id,
      name: community.name,
      updatedBy: req.user.email
    });

    res.status(200).json({
      success: true,
      message: 'Community updated successfully',
      community: {
        id: community._id,
        name: community.name,
        description: community.description,
        settings: community.settings,
        updatedAt: community.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ Update community error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating community',
      error: error.message
    });
  }
};

// =======================================
// @desc    Leave community
// @route   DELETE /api/communities/:id/leave
// @access  Private
// =======================================
export const leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    console.log('🔍 Leaving community:', { id, userId });

    // Find community
    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is a member
    if (!community.isMember(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this community'
      });
    }

    // Prevent creator from leaving
    if (community.createdBy.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Community creator cannot leave. Delete the community instead.'
      });
    }

    // Remove user from community members
    community.members = community.members.filter(
      member => member.user.toString() !== userId.toString()
    );

    community.lastActivity = new Date();
    await community.save();

    console.log('✅ User left community:', { userId, community: community.name });

    res.status(200).json({
      success: true,
      message: `You have left ${community.name}`
    });
  } catch (error) {
    console.error('❌ Leave community error:', error);
    res.status(500).json({
      success: false,
      message: 'Error leaving community',
      error: error.message
    });
  }
};

// =======================================
// @desc    Delete community
// @route   DELETE /api/communities/:id
// @access  Private (Creator only)
// =======================================
export const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    console.log('🔍 Deleting community:', { id, userId });

    // Find community
    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Only creator can delete
    if (community.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the community creator can delete it.'
      });
    }

    const communityName = community.name;

    // Delete the community
    await Community.findByIdAndDelete(id);

    console.log('✅ Community deleted:', {
      id: id,
      name: communityName,
      deletedBy: req.user.email
    });

    res.status(200).json({
      success: true,
      message: `${communityName} has been deleted successfully`
    });
  } catch (error) {
    console.error('❌ Delete community error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting community',
      error: error.message
    });
  }
};

// =======================================
// @desc    Promote member to admin
// @route   PUT /api/communities/:id/promote/:memberId
// @access  Private (Admin only)
// =======================================
export const promoteMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user._id || req.user.id;

    console.log('🔍 Promoting member:', { id, memberId, userId });

    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if requester is admin
    if (!community.isAdmin(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can promote members'
      });
    }

    // Find member
    const memberIndex = community.members.findIndex(
      m => m.user.toString() === memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this community'
      });
    }

    // Update role
    community.members[memberIndex].role = 'admin';
    community.lastActivity = new Date();
    await community.save();

    console.log('✅ Member promoted:', {
      community: community.name,
      memberId,
      promotedBy: req.user.email
    });

    res.status(200).json({
      success: true,
      message: 'Member promoted to admin successfully'
    });
  } catch (error) {
    console.error('❌ Promote member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error promoting member',
      error: error.message
    });
  }
};

// =======================================
// @desc    Demote admin to member
// @route   PUT /api/communities/:id/demote/:memberId
// @access  Private (Creator only)
// =======================================
export const demoteMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user._id || req.user.id;

    console.log('🔍 Demoting member:', { id, memberId, userId });

    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Only creator can demote
    if (community.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the community creator can demote admins'
      });
    }

    // Cannot demote creator
    if (memberId === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot demote the community creator'
      });
    }

    // Find member
    const memberIndex = community.members.findIndex(
      m => m.user.toString() === memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this community'
      });
    }

    // Update role
    community.members[memberIndex].role = 'member';
    community.lastActivity = new Date();
    await community.save();

    console.log('✅ Admin demoted:', {
      community: community.name,
      memberId,
      demotedBy: req.user.email
    });

    res.status(200).json({
      success: true,
      message: 'Admin demoted to member successfully'
    });
  } catch (error) {
    console.error('❌ Demote member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error demoting member',
      error: error.message
    });
  }
};

// =======================================
// @desc    Remove member from community
// @route   DELETE /api/communities/:id/members/:memberId
// @access  Private (Admin only)
// =======================================
export const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user._id || req.user.id;

    console.log('🔍 Removing member:', { id, memberId, userId });

    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if requester is admin
    if (!community.isAdmin(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can remove members'
      });
    }

    // Cannot remove creator
    if (community.createdBy.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the community creator'
      });
    }

    // Remove member
    const initialLength = community.members.length;
    community.members = community.members.filter(
      m => m.user.toString() !== memberId
    );

    if (community.members.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this community'
      });
    }

    community.lastActivity = new Date();
    await community.save();

    console.log('✅ Member removed:', {
      community: community.name,
      memberId,
      removedBy: req.user.email
    });

    res.status(200).json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('❌ Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing member',
      error: error.message
    });
  }
};

// =======================================
// @desc    Search communities by name
// @route   GET /api/communities/search?q=searchTerm
// @access  Private
// =======================================
export const searchCommunities = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user._id || req.user.id;

    console.log('🔍 Searching communities:', { q, userId });

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search in user's communities
    const communities = await Community.find({
      'members.user': userId,
      isActive: true,
      name: { $regex: q, $options: 'i' }
    })
    .populate('createdBy', 'name email username avatar picture')
    .limit(20)
    .sort({ lastActivity: -1 });

    console.log('✅ Found', communities.length, 'matching communities');

    const formattedCommunities = communities.map(community => {
      const member = community.members.find(
        m => m.user.toString() === userId.toString()
      );

      return {
        id: community._id,
        _id: community._id,
        name: community.name,
        description: community.description,
        code: community.code,
        members: community.members.length,
        isAdmin: member?.role === 'admin',
        createdBy: {
          id: community.createdBy._id,
          name: community.createdBy.name,
          avatar: community.createdBy.avatar || community.createdBy.picture
        }
      };
    });

    res.status(200).json({
      success: true,
      count: formattedCommunities.length,
      communities: formattedCommunities
    });
  } catch (error) {
    console.error('❌ Search communities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching communities',
      error: error.message
    });
  }
};
