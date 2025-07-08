const express = require("express");
const router = express.Router();

// 📦 User controller functions
const {
  getUserProfile,
  createOrUpdateProfile,
  updateProfileLinks,
  verifyEmail,
  deleteProfile,
  getAllUsers,
  checkUsernameAvailability,
} = require("../controllers/userController");

// 📊 Stats controller functions
const {
  getGitHubStats,
  getLeetCodeStats,
  getCodeforcesStats,
  getHackerRankStats,
} = require("../controllers/statsController");

// 🛡️ Profile routes
router.get("/profile/:firebaseUid", getUserProfile);
router.post("/profile", createOrUpdateProfile);
router.put("/profile/:firebaseUid/links", updateProfileLinks);
router.put("/profile/:firebaseUid/verify", verifyEmail);
router.delete("/profile/:firebaseUid", deleteProfile);

// 👤 Username routes
router.get("/username/check/:username", checkUsernameAvailability);

// 👥 Admin routes
router.get("/all", getAllUsers);

// 📈 Stats routes
router.get("/stats/github", getGitHubStats);
router.get("/stats/leetcode", getLeetCodeStats);
router.get("/stats/codeforces", getCodeforcesStats);
router.get("/stats/hackerrank", getHackerRankStats);

module.exports = router;
