import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Community name is required'],
      trim: true,
      minlength: [3, 'Community name must be at least 3 characters'],
      maxlength: [100, 'Community name cannot exceed 100 characters']
    },

    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      length: 4
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        role: {
          type: String,
          enum: ['admin', 'member'],
          default: 'member'
        },
        joinedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    settings: {
      isPublic: {
        type: Boolean,
        default: false
      },
      maxMembers: {
        type: Number,
        default: 100,
        min: 2,
        max: 1000
      },
      allowMemberInvite: {
        type: Boolean,
        default: true
      },
      autoApprove: {
        type: Boolean,
        default: true
      }
    },

    garden: {
      plants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Plant'
        }
      ],
      layout: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: new Map()
      }
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// =======================================
// INDEXES
// =======================================
CommunitySchema.index({ code: 1 });
CommunitySchema.index({ createdBy: 1 });
CommunitySchema.index({ 'members.user': 1 });
CommunitySchema.index({ name: 'text', description: 'text' });
CommunitySchema.index({ isActive: 1 });
CommunitySchema.index({ createdAt: -1 });

// =======================================
// VIRTUALS
// =======================================
CommunitySchema.virtual('memberCount').get(function () {
  return this.members ? this.members.length : 0;
});

// =======================================
// INSTANCE METHODS
// =======================================

// Check if user is a member
CommunitySchema.methods.isMember = function (userId) {
  return this.members.some(
    member => member.user.toString() === userId.toString()
  );
};

// Check if user is admin
CommunitySchema.methods.isAdmin = function (userId) {
  const member = this.members.find(
    m => m.user.toString() === userId.toString()
  );
  return member && member.role === 'admin';
};

// Add member to community
CommunitySchema.methods.addMember = async function (userId, role = 'member') {
  if (this.isMember(userId)) {
    throw new Error('User is already a member');
  }

  this.members.push({
    user: userId,
    role: role,
    joinedAt: new Date()
  });

  this.lastActivity = new Date();
  return await this.save();
};

// Remove member from community
CommunitySchema.methods.removeMember = async function (userId) {
  if (!this.isMember(userId)) {
    throw new Error('User is not a member');
  }

  this.members = this.members.filter(
    member => member.user.toString() !== userId.toString()
  );

  this.lastActivity = new Date();
  return await this.save();
};

// Update member role
CommunitySchema.methods.updateMemberRole = async function (userId, newRole) {
  const memberIndex = this.members.findIndex(
    m => m.user.toString() === userId.toString()
  );

  if (memberIndex === -1) {
    throw new Error('User is not a member');
  }

  this.members[memberIndex].role = newRole;
  this.lastActivity = new Date();
  return await this.save();
};

// =======================================
// STATIC METHODS
// =======================================

// Generate unique 4-digit code
CommunitySchema.statics.generateUniqueCode = async function () {
  let code;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isUnique && attempts < maxAttempts) {
    // Generate random 4-digit code
    code = Math.floor(1000 + Math.random() * 9000).toString();

    // Check if code already exists
    const existing = await this.findOne({ code });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Unable to generate unique community code');
  }

  return code;
};

// Find communities by user
CommunitySchema.statics.findByUser = function (userId) {
  return this.find({
    'members.user': userId,
    isActive: true
  }).populate('createdBy', 'name email username avatar picture');
};

// Search communities
CommunitySchema.statics.searchCommunities = function (query, userId) {
  return this.find({
    'members.user': userId,
    isActive: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  }).limit(20);
};

// Get community statistics
CommunitySchema.statics.getCommunityStats = async function () {
  const [total, active, totalMembers] = await Promise.all([
    this.countDocuments({}),
    this.countDocuments({ isActive: true }),
    this.aggregate([
      { $match: { isActive: true } },
      { $project: { memberCount: { $size: '$members' } } },
      { $group: { _id: null, total: { $sum: '$memberCount' } } }
    ])
  ]);

  return {
    totalCommunities: total,
    activeCommunities: active,
    totalMembers: totalMembers[0]?.total || 0,
    averageMembers: active > 0 ? Math.round((totalMembers[0]?.total || 0) / active) : 0
  };
};

// =======================================
// NO PRE/POST HOOKS - REMOVED TO FIX ERROR
// =======================================
// We'll handle lastActivity updates manually in controllers

const Community = mongoose.model('Community', CommunitySchema);

export default Community;
