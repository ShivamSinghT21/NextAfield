import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// =======================================
// BASIC USER SCHEMA FOR SKYGROW
// =======================================
const UserSchema = new mongoose.Schema(
  {
    // ---- AUTHENTICATION ----
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    username: { 
      type: String, 
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },

    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },

    password: { 
      type: String,
      minlength: [6, 'Password must be at least 6 characters']
      // Not required for Google OAuth users
    },

    googleId: { 
      type: String, 
      unique: true, 
      sparse: true 
    },

    // ---- AUTH PROVIDER ----
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },

    // ---- PROFILE ----
    avatar: { 
      type: String, 
      default: "" 
    },

    picture: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: "",
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      trim: true
    },

    // ---- ROLE ----
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    // ---- STATUS ----
    isVerified: { 
      type: Boolean, 
      default: false 
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // ---- ACTIVITY ----
    lastLogin: { 
      type: Date, 
      default: Date.now 
    },
  },
  { 
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// =======================================
// INDEXES: Improve query performance
// =======================================
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ lastLogin: -1 });

// =======================================
// VIRTUAL: Full name or display name
// =======================================
UserSchema.virtual("displayName").get(function () {
  return this.name || this.username || this.email.split('@')[0];
});

// =======================================
// PRE-SAVE MIDDLEWARE: Hash password
// =======================================
UserSchema.pre('save', async function(next) {
  // Only hash password if it's modified and exists
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// =======================================
// METHOD: Compare password
// =======================================
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    throw new Error('Password not set for this user');
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// =======================================
// METHOD: Update last login
// =======================================
UserSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return this.save();
};

// =======================================
// METHOD: Check if user is admin
// =======================================
UserSchema.methods.isAdmin = function () {
  return this.role === 'admin';
};

// =======================================
// METHOD: Check if profile is complete
// =======================================
UserSchema.methods.hasCompleteProfile = function () {
  return !!(this.name && this.email && this.username);
};

// =======================================
// METHOD: Get basic user info (safe to send to client)
// =======================================
UserSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    _id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    avatar: this.avatar || this.picture,
    bio: this.bio,
    role: this.role,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin
  };
};

// =======================================
// METHOD: Get full profile (for authenticated user)
// =======================================
UserSchema.methods.getFullProfile = function () {
  return {
    id: this._id,
    _id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    avatar: this.avatar || this.picture,
    picture: this.picture,
    bio: this.bio,
    role: this.role,
    authProvider: this.authProvider,
    isVerified: this.isVerified,
    isActive: this.isActive,
    googleId: this.googleId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    lastLogin: this.lastLogin
  };
};

// =======================================
// STATIC: Find user by email or username
// =======================================
UserSchema.statics.findByEmailOrUsername = function (identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier.toLowerCase() }
    ]
  });
};

// =======================================
// STATIC: Find all admins
// =======================================
UserSchema.statics.findAdmins = function () {
  return this.find({ role: 'admin', isActive: true });
};

// =======================================
// STATIC: Get user count by role
// =======================================
UserSchema.statics.countByRole = async function () {
  const users = await this.countDocuments({ role: 'user', isActive: true });
  const admins = await this.countDocuments({ role: 'admin', isActive: true });

  return {
    users,
    admins,
    total: users + admins
  };
};

// =======================================
// STATIC: Find users with incomplete profiles
// =======================================
UserSchema.statics.findIncompleteProfiles = function () {
  return this.find({
    isActive: true,
    $or: [
      { name: { $exists: false } },
      { name: '' },
      { username: { $exists: false } },
      { username: '' }
    ]
  });
};

// =======================================
// STATIC: Get active users count
// =======================================
UserSchema.statics.getActiveUsersCount = async function () {
  const now = new Date();
  
  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [daily, weekly, monthly, total] = await Promise.all([
    this.countDocuments({ lastLogin: { $gte: oneDayAgo }, isActive: true }),
    this.countDocuments({ lastLogin: { $gte: oneWeekAgo }, isActive: true }),
    this.countDocuments({ lastLogin: { $gte: oneMonthAgo }, isActive: true }),
    this.countDocuments({ isActive: true })
  ]);

  return {
    daily,
    weekly,
    monthly,
    total
  };
};

// =======================================
// STATIC: Search users
// =======================================
UserSchema.statics.searchUsers = function (query, limit = 20) {
  return this.find({
    isActive: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ]
  })
  .select('-password')
  .limit(limit)
  .sort({ name: 1 });
};

// =======================================
// STATIC: Get user statistics
// =======================================
UserSchema.statics.getUserStats = async function () {
  const [totalUsers, activeUsers, verifiedUsers, googleUsers, localUsers] = await Promise.all([
    this.countDocuments({}),
    this.countDocuments({ isActive: true }),
    this.countDocuments({ isVerified: true }),
    this.countDocuments({ authProvider: 'google' }),
    this.countDocuments({ authProvider: 'local' })
  ]);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    verifiedUsers,
    unverifiedUsers: totalUsers - verifiedUsers,
    googleUsers,
    localUsers
  };
};

export default mongoose.model("User", UserSchema);
