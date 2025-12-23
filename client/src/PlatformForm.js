import React, { useState } from "react";

function PlatformForm({ onSubmit, onVerifyClick, onMobileVerifyClick, onBack, initialData = null, isEditing = false }) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    contact: initialData?.contact || "",
    address: initialData?.address || "",
    linkedin: initialData?.linkedin || "",
    profilePicture: initialData?.profilePicture || "",
    username: initialData?.username || "",
    github: initialData?.github || "",
    leetcode: initialData?.leetcode || "",
    codeforces: initialData?.codeforces || "",
    hackerrank: initialData?.hackerrank || ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState("");
  const [profilePicturePreview, setProfilePicturePreview] = useState(initialData?.profilePicture || "");
  const [usernameStatus, setUsernameStatus] = useState({ available: null, message: "" });
  const [checkingUsername, setCheckingUsername] = useState(false);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.username.trim()) newErrors.username = "Username is required";
      else if (!/^[a-zA-Z0-9._]+$/.test(formData.username)) newErrors.username = "Username can only contain letters, numbers, dots, and underscores";
      else if (formData.username.length < 3 || formData.username.length > 30) newErrors.username = "Username must be between 3 and 30 characters";
      else if (usernameStatus.available === false) newErrors.username = "Username is already taken";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
      if (!formData.contact.trim()) newErrors.contact = "Contact number is required";
      else if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = "Contact must be a valid 10-digit number";
    }
    
    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.linkedin.trim()) newErrors.linkedin = "LinkedIn URL is required";
      else if (!formData.linkedin.includes("linkedin.com")) newErrors.linkedin = "Please enter a valid LinkedIn URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    try {
      setLoading(true);
      setMessage("");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem("profileData", JSON.stringify(formData));
      onSubmit(formData);
      setMessage("Profile saved successfully!");
    } catch (error) {
      setMessage("Failed to save profile. Please try again.");
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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        setFormData({ ...formData, profilePicture: imageData });
        setProfilePicturePreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus({ available: null, message: "" });
      return;
    }

    setCheckingUsername(true);
    try {
      const response = await fetch(`http://localhost:8080/api/users/username/check/${username}`);
      let data = null;
      try {
        data = await response.json();
      } catch (jsonErr) {
        // If response is not JSON
        setUsernameStatus({ available: false, message: "Server error. Please try again." });
        return;
      }
      if (!response.ok) {
        setUsernameStatus({ available: false, message: data?.message || "Error checking username availability" });
      } else {
        setUsernameStatus({ available: data.available, message: data.message });
      }
    } catch (error) {
      setUsernameStatus({ available: false, message: "Network error. Please check your connection." });
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setFormData({ ...formData, username });
    
    // Debounce username check
    clearTimeout(window.usernameCheckTimeout);
    window.usernameCheckTimeout = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 500);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Personal Information</h2>
        <p className="text-gray-600">Let's start with your basic details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleChange} 
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
          <input 
            name="username" 
            value={formData.username} 
            onChange={handleUsernameChange} 
            className={`w-full px-4 py-3 pl-8 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
              errors.username ? "border-red-500" : usernameStatus.available === false ? "border-red-500" : usernameStatus.available === true ? "border-green-500" : "border-gray-300"
            }`}
            placeholder="Choose a unique username"
          />
          {checkingUsername && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            </div>
          )}
          {usernameStatus.available === true && !checkingUsername && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              ✓
            </div>
          )}
          {usernameStatus.available === false && !checkingUsername && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
              ✗
            </div>
            )}
        </div>
        {usernameStatus.message && (
          <p className={`text-sm mt-1 ${usernameStatus.available === true ? "text-green-600" : usernameStatus.available === false ? "text-red-500" : "text-gray-500"}`}>
            {usernameStatus.message}
          </p>
        )}
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        <p className="text-gray-500 text-sm mt-1">Username must be 3-30 characters, letters, numbers, dots, and underscores only</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
        <input 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
        <input 
          name="contact" 
          value={formData.contact} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
            errors.contact ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your 10-digit phone number"
        />
        {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture (Optional)</label>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
            {profilePicturePreview ? (
              <img 
                src={profilePicturePreview} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <input 
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
        <p className="text-gray-500 text-sm">Add a profile picture. If not provided, a default avatar will be used.</p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Professional Details</h2>
        <p className="text-gray-600">Tell us about your professional presence</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
        <input 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
            errors.address ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your address"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile URL *</label>
        <input 
          name="linkedin" 
          value={formData.linkedin} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
            errors.linkedin ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="https://linkedin.com/in/your-profile"
        />
        {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Coding Profiles</h2>
        <p className="text-gray-600">Connect your coding platform profiles</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">github.com/</span>
            <input 
              name="github" 
              value={formData.github} 
              onChange={handleChange} 
              className="w-full px-4 py-3 pl-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="username"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LeetCode Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">leetcode.com/</span>
            <input 
              name="leetcode" 
              value={formData.leetcode} 
              onChange={handleChange} 
              className="w-full px-4 py-3 pl-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="username"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Codeforces Handle</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">codeforces.com/profile/</span>
            <input 
              name="codeforces" 
              value={formData.codeforces} 
              onChange={handleChange} 
              className="w-full px-4 py-3 pl-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="handle"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">HackerRank Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">hackerrank.com/</span>
            <input 
              name="hackerrank" 
              value={formData.hackerrank} 
              onChange={handleChange} 
              className="w-full px-4 py-3 pl-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="username"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <span className="text-xl">←</span>
                  <span>Back</span>
                </button>
              )}
              <h1 className="text-2xl font-bold text-purple-700">
                {isEditing ? "Edit Your Profile" : "Complete Your Profile"}
              </h1>
            </div>
            <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {message && (
            <div className={`p-4 rounded-lg text-sm mb-4 ${
              message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {message}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-3">
              {formData.email && (
                <button
                  type="button"
                  onClick={() => onVerifyClick()}
                  className="px-6 py-3 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-all"
                >
                  Verify Email
                </button>
              )}

              {formData.contact && (
                <button
                  type="button"
                  onClick={() => onMobileVerifyClick()}
                  className="px-6 py-3 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-all"
                >
                  Verify Mobile
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : (isEditing ? "Update Profile" : "Complete Profile")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlatformForm;
