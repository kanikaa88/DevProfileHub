const OTP = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");
const otpGenerator = require("otp-generator");

const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // Check if there's a recent OTP for this email (within 30 seconds)
    const recentOtp = await OTP.findOne({ 
      email, 
      createdAt: { $gte: new Date(Date.now() - 30000) } // 30 seconds ago
    });

    if (recentOtp) {
      return res.status(429).json({ 
        message: "Please wait 30 seconds before requesting another OTP" 
      });
    }

    const otpCode = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    const otp = new OTP({
      email,
      code: otpCode,
      createdAt: new Date(),
    });

    await otp.save();

    const text = `Your DevProfile Hub verification code is: ${otpCode}`;
    const html = `<p>Hello 👋</p><p>Your <strong>DevProfile Hub</strong> verification code is:</p><h2 style="color: #6B21A8">${otpCode}</h2><p>This code will expire in 5 minutes.</p>`;

    await sendEmail(email, "DevProfile Hub - Your OTP Code", html, text);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOTP = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email and code required" });
  }

  try {
    // 🔍 Get the latest OTP for the email
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 }).lean();


    if (!otpRecord) {
      return res.status(400).json({ message: "No OTP found for this email" });
    }

    // 🔍 Check if code matches
    if (otpRecord.code !== code.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ⏳ Check if OTP expired (valid for 5 minutes)
    const now = new Date();
    const diff = (now - otpRecord.createdAt) / 1000;
    if (diff > 300) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Verified — delete OTPs for cleanup
    await OTP.deleteMany({ email });
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ message: "Server error" });
    console.log("Expected OTP:", otpRecord.code, "Entered OTP:", code.trim());

  }
};


const sendMobileOTP = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) return res.status(400).json({ message: "Mobile number is required" });

  try {
    // Check if there's a recent OTP for this mobile (within 30 seconds)
    const recentOtp = await OTP.findOne({ 
      email: mobile, // We'll use email field to store mobile for simplicity
      createdAt: { $gte: new Date(Date.now() - 30000) } // 30 seconds ago
    });

    if (recentOtp) {
      return res.status(429).json({ 
        message: "Please wait 30 seconds before requesting another OTP" 
      });
    }

    const otpCode = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    const otp = new OTP({
      email: mobile, // Using email field to store mobile
      code: otpCode,
      createdAt: new Date(),
    });

    await otp.save();

    // For now, we'll just log the OTP since we don't have SMS service
    console.log(`Mobile OTP for ${mobile}: ${otpCode}`);

    res.status(200).json({ message: "OTP sent to your mobile number" });
  } catch (err) {
    console.error("Error sending mobile OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyMobileOTP = async (req, res) => {
  const { mobile, code } = req.body;

  if (!mobile || !code) {
    return res.status(400).json({ message: "Mobile number and code required" });
  }

  try {
    // Get the latest OTP for the mobile
    const otpRecord = await OTP.findOne({ email: mobile }).sort({ createdAt: -1 }).lean();

    if (!otpRecord) {
      return res.status(400).json({ message: "No OTP found for this mobile number" });
    }

    // Check if code matches
    if (otpRecord.code !== code.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP expired (valid for 5 minutes)
    const now = new Date();
    const diff = (now - otpRecord.createdAt) / 1000;
    if (diff > 300) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Verified — delete OTPs for cleanup
    await OTP.deleteMany({ email: mobile });
    return res.status(200).json({ message: "Mobile number verified successfully" });
  } catch (err) {
    console.error("Mobile OTP verification error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { sendOTP, verifyOTP, sendMobileOTP, verifyMobileOTP };
