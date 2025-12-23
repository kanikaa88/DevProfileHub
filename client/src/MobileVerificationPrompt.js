// MobileVerificationPrompt.js
import React, { useState, useEffect, useCallback } from "react";

function MobileVerificationPrompt({ mobile, onVerified, onBack }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOTP = useCallback(async () => {
    try {
      setSendingOtp(true);
      setMessage("");
      
      const response = await fetch("http://localhost:8080/api/otp/send-mobile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("OTP sent to your mobile number!");
        setOtpSent(true);
        // Mark that we've sent an OTP for this mobile in this session
        sessionStorage.setItem(`mobile_otp_sent_${mobile}`, 'true');
      } else {
        setMessage(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  }, [mobile]);

  // Send OTP when component mounts, but only if not already sent in this session
  useEffect(() => {
    // Check if we already sent an OTP in this session
    const sessionOtpSent = sessionStorage.getItem(`mobile_otp_sent_${mobile}`);
    if (!sessionOtpSent) {
      sendOTP();
    } else {
      setOtpSent(true);
      setMessage("OTP already sent to your mobile number!");
    }
  }, [mobile, sendOTP]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setMessage("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      
      const response = await fetch("http://localhost:8080/api/otp/verify-mobile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, code: otp.trim() }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("Mobile number verified successfully!");
        // Clear the session storage when verification is successful
        sessionStorage.removeItem(`mobile_otp_sent_${mobile}`);
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
        {/* Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
          <div className="text-4xl">📱</div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-purple-700 mb-2">Verify Your Mobile</h1>
          <p className="text-gray-600">
            {sendingOtp ? "Sending verification code..." : 
             otpSent ? `We've sent a verification code to ${mobile}` :
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
            {loading ? "Verifying..." : "Verify Mobile"}
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

export default MobileVerificationPrompt;
