const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, sendMobileOTP, verifyMobileOTP } = require("../controllers/otpController");

router.post("/send", sendOTP);              // for /api/otp/send
router.post("/verify", verifyOTP);          // for /api/otp/verify
router.post("/send-mobile", sendMobileOTP); // for /api/otp/send-mobile
router.post("/verify-mobile", verifyMobileOTP); // for /api/otp/verify-mobile

module.exports = router;
