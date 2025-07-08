const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Get user profile by Firebase UID
const getUserProfile = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    
    if (!firebaseUid) {
      return res.status(400).json({ message: "Firebase UID is required" });
    }

    const user = await User.findOne({ firebaseUid }).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Check username availability
const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ available: false, message: "Username is required" });
    }
    // Pattern and length checks
    const usernamePattern = /^[a-zA-Z0-9._]+$/;
    if (!usernamePattern.test(username)) {
      return res.status(400).json({ available: false, message: "Username can only contain letters, numbers, dots, and underscores" });
    }
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ available: false, message: "Username must be between 3 and 30 characters" });
    }
    // Check if username is already taken
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(200).json({ available: false, message: "Username is already taken" });
    }
    res.status(200).json({ available: true, message: "Username is available" });
  } catch (err) {
    console.error("Error in checkUsernameAvailability:", err);
    res.status(500).json({ available: false, message: "Server error" });
  }
};

// Create or update user profile
const createOrUpdateProfile = async (req, res) => {
  try {
    const { firebaseUid, email, username, ...profileData } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ message: "Firebase UID and email are required" });
    }

    // If username is provided, check if it's available
    if (username) {
      const existingUser = await User.findOne({ 
        username: username.toLowerCase(),
        firebaseUid: { $ne: firebaseUid } // Exclude current user
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: "Username is already taken. Please choose a different username." 
        });
      }
    }

    console.log("Creating/updating profile for:", { firebaseUid, email, username });

    // Check if user exists by firebaseUid OR email
    let user = await User.findOne({ 
      $or: [{ firebaseUid }, { email }] 
    });

    if (user) {
      console.log("User exists, updating...");
      // Update existing user
      user = await User.findOneAndUpdate(
        { _id: user._id },
        { 
          firebaseUid, 
          email, 
          username: username ? username.toLowerCase() : user.username,
          ...profileData, 
          updatedAt: Date.now() 
        },
        { new: true, runValidators: true }
      );
    } else {
      console.log("User does not exist, creating new...");
      // Create new user
      user = new User({
        firebaseUid,
        email,
        username: username ? username.toLowerCase() : null,
        ...profileData
      });
      await user.save();
    }

    console.log("Profile saved successfully:", user._id);

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: user
    });
  } catch (err) {
    console.error("Error in createOrUpdateProfile:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: Object.values(err.errors).map(e => e.message) 
      });
    }
    if (err.code === 11000) {
      if (err.keyPattern.username) {
        return res.status(400).json({ 
          message: "Username is already taken. Please choose a different username." 
        });
      }
      return res.status(400).json({ 
        message: "User with this email already exists. Please use a different email or contact support." 
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile links (coding platforms)
const updateProfileLinks = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { github, leetcode, codeforces, hackerrank } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({ message: "Firebase UID is required" });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { 
        github, 
        leetcode, 
        codeforces, 
        hackerrank,
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile links updated successfully",
      data: user
    });
  } catch (err) {
    console.error("Error in updateProfileLinks:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark email as verified
const verifyEmail = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({ message: "Firebase UID is required" });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { emailVerified: true, updatedAt: Date.now() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: user
    });
  } catch (err) {
    console.error("Error in verifyEmail:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user profile
const deleteProfile = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({ message: "Firebase UID is required" });
    }

    const user = await User.findOneAndDelete({ firebaseUid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    });
  } catch (err) {
    console.error("Error in deleteProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (for admin purposes)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  createOrUpdateProfile,
  updateProfileLinks,
  verifyEmail,
  deleteProfile,
  getAllUsers,
  checkUsernameAvailability
};


