// Login.js
import React, { useState } from "react";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "./firebase";

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setMessage("");
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google Login Error:", err);
      setMessage("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setMessage("");
      
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        // No need to set a message here; Firebase will log the user in and App.js will show PlatformForm
        // Optionally, you could set a toast or notification here
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        // No need to set a message here; App.js will handle the transition
      }
    } catch (err) {
      console.error("Auth Error:", err);
      if (err.code === "auth/user-not-found") {
        setMessage("No account found with this email. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        setMessage("Incorrect password. Please try again.");
      } else if (err.code === "auth/email-already-in-use") {
        setMessage("An account with this email already exists. Please sign in.");
      } else if (err.code === "auth/too-many-requests") {
        setMessage("Too many failed attempts. Please try again later or reset your password.");
      } else {
        setMessage("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Full-screen Pinterest-style geometric/tech image background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80"
          alt="Geometric Tech Background"
          className="w-full h-full object-cover object-center"
          draggable="false"
        />
      </div>
      <div className="relative z-20 w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-12 p-4">
        {/* Illustration (desktop only) */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="160" cy="160" rx="140" ry="140" fill="#f3e8ff" />
            <ellipse cx="160" cy="160" rx="110" ry="110" fill="#f7e3f3" />
            <ellipse cx="160" cy="160" rx="80" ry="80" fill="#e0d7fa" />
            <text x="50%" y="54%" textAnchor="middle" fill="#a21caf" fontSize="2.5rem" fontWeight="bold" dy=".3em">👩‍💻</text>
          </svg>
        </div>
        {/* Glassmorphism Card */}
        <div className="flex-1 bg-white/70 dark:bg-gray-900/70 rounded-3xl shadow-2xl p-10 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full transition-all">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <span className="inline-block w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center text-3xl shadow-lg border border-gray-200">🌸</span>
            </div>
            <h1 className="text-4xl font-extrabold text-purple-800 dark:text-purple-200 mb-1 tracking-tight drop-shadow-sm">DevProfile Hub</h1>
            <p className="text-gray-500 dark:text-gray-300 text-base">Connect your coding profiles in one place</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white/90 dark:bg-gray-800/90 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 flex items-center justify-center gap-3 mb-6 font-semibold text-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="drop-shadow-sm">Continue with Google</span>
          </button>

          {/* Animated Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700 animate-pulse"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-300 font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`peer w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/95 dark:bg-gray-800/90 placeholder-transparent text-gray-900 dark:text-gray-100 ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
                placeholder="Email address"
                autoComplete="email"
                aria-label="Email Address"
              />
              <label className="absolute left-4 top-3 text-gray-400 dark:text-gray-300 pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-purple-600 dark:peer-focus:text-purple-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-300 bg-white/80 dark:bg-gray-900/80 px-1 rounded shadow-sm">
                Email Address
              </label>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`peer w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/95 dark:bg-gray-800/90 placeholder-transparent text-gray-900 dark:text-gray-100 ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
                placeholder="Password"
                autoComplete="current-password"
                aria-label="Password"
              />
              <label className="absolute left-4 top-3 text-gray-400 dark:text-gray-300 pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-purple-600 dark:peer-focus:text-purple-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-300 bg-white/80 dark:bg-gray-900/80 px-1 rounded shadow-sm">
                Password
              </label>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            {isSignUp && (
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`peer w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/95 dark:bg-gray-800/90 placeholder-transparent text-gray-900 dark:text-gray-100 ${errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  aria-label="Confirm Password"
                />
                <label className="absolute left-4 top-3 text-gray-400 dark:text-gray-300 pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-purple-600 dark:peer-focus:text-purple-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-300 bg-white/80 dark:bg-gray-900/80 px-1 rounded shadow-sm">
                  Confirm Password
                </label>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}
            {message && (
              <div className={`p-3 rounded-lg text-sm mt-2 ${message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-400 to-orange-300 hover:from-purple-700 hover:to-orange-400 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              {loading ? "Loading..." : (isSignUp ? "Create Account" : "Sign In")}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-300 text-base">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-purple-700 dark:text-purple-300 font-semibold underline underline-offset-4 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200"
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
