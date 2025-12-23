const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// 📦 User controller functions
const {
  getUserProfile,
  getUserProfileByUsername,
  createOrUpdateProfile,
  updateProfileLinks,
  verifyEmail,
  deleteProfile,
  getAllUsers,
  checkUsernameAvailability,
  uploadResume,
  updateProjects,
  serveFile,
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
router.get("/public/:username", getUserProfileByUsername); // Public profile by username
router.post("/profile", createOrUpdateProfile);
router.put("/profile/:firebaseUid/links", updateProfileLinks);
router.put("/profile/:firebaseUid/verify", verifyEmail);
router.delete("/profile/:firebaseUid", deleteProfile);

// 📄 Resume and Projects routes
router.post("/profile/:firebaseUid/resume", upload.single('resume'), uploadResume);
router.put("/profile/:firebaseUid/projects", updateProjects);
router.get("/uploads/:filename", serveFile);

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
