const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../controllers/otpController");

router.post("/send", sendOTP);      // for /api/otp/send
router.post("/verify", verifyOTP);  // for /api/otp/verify

module.exports = router;
