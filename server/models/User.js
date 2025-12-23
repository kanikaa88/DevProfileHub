const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Firebase auth data
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  
  // Unique username like Instagram
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9._]+$/
  },
  
  // Personal information
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  contact: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  
  // Professional profiles
  linkedin: {
    type: String,
    required: true
  },
  
  // Coding platform usernames
  github: String,
  leetcode: String,
  codeforces: String,
  hackerrank: String,
  
  // Resume and projects
  resumeUrl: String,
  projects: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
    }],
    points: [{
      type: String,
    }],
    links: {
      github: String,
      live: String,
      demo: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Additional fields
  bio: String,
  portfolioLink: String,
  
  // Verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", userSchema);
