// VerificationPrompt.js
import React, { useState, useEffect } from "react";

function VerificationPrompt({ email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Send OTP when component mounts
  useEffect(() => {
    sendOTP();
  }, []);

  const sendOTP = async () => {
    try {
      setSendingOtp(true);
      setMessage("");
      
      const response = await fetch("http://localhost:8080/api/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("OTP sent to your email!");
        setOtpSent(true);
      } else {
        setMessage(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setMessage("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      
      const response = await fetch("http://localhost:8080/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: otp.trim() }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("Email verified successfully!");
        setTimeout(() => {
          onVerified();
        }, 1000);
      } else {
        setMessage(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-purple-700 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            {sendingOtp ? "Sending verification code..." : 
             otpSent ? `We've sent a verification code to ${email}` :
             "Preparing to send verification code..."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{" "}
            <button 
              onClick={sendOTP}
              disabled={sendingOtp}
              className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
            >
              {sendingOtp ? "Sending..." : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerificationPrompt;
