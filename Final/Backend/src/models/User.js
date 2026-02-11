import mongoose from "mongoose";

// =======================================
// BASIC USER SCHEMA FOR SKYGROW
// =======================================
const UserSchema = new mongoose.Schema(
  {
    // ---- AUTHENTICATION ----
    name: { 
      type: String, 
      required: true,
      trim: true
    },

    username: { 
      type: String, 
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true
    },

    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },

    password: { 
      type: String,
      // Not required for Google OAuth users
    },

    googleId: { 
      type: String, 
      unique: true, 
      sparse: true 
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
    toJSON: { virtuals: true },
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

// =======================================
// VIRTUAL: Full name or display name
// =======================================
UserSchema.virtual("displayName").get(function () {
  return this.name || this.username || this.email.split('@')[0];
});

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
// METHOD: Get basic user info (safe to send to client)
// =======================================
UserSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    avatar: this.avatar || this.picture,
    role: this.role,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
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
  return this.find({ role: 'admin' });
};

// =======================================
// STATIC: Get user count by role
// =======================================
UserSchema.statics.countByRole = async function () {
  const users = await this.countDocuments({ role: 'user' });
  const admins = await this.countDocuments({ role: 'admin' });

  return {
    users,
    admins,
    total: users + admins
  };
};

export default mongoose.model("User", UserSchema);
