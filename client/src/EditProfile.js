import React, { useState } from "react";

function EditProfile({ profileData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: profileData?.firstName || "",
    lastName: profileData?.lastName || "",
    email: profileData?.email || "",
    contact: profileData?.contact || "",
    address: profileData?.address || "",
    linkedin: profileData?.linkedin || "",
    profilePicture: profileData?.profilePicture || "",
    username: profileData?.username || "",
    github: profileData?.github || "",
    leetcode: profileData?.leetcode || "",
    codeforces: profileData?.codeforces || "",
    hackerrank: profileData?.hackerrank || ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profilePicturePreview, setProfilePicturePreview] = useState(profileData?.profilePicture || "");

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = "Contact must be a valid 10-digit number";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setMessage("");
      
      await onSave(formData);
      setMessage("Account updated successfully!");
    } catch (error) {
      setMessage("Failed to update account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-purple-700">Your Account</h1>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
              
              {/* Profile Picture */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                    {profilePicturePreview ? (
                      <img 
                        src={profilePicturePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">👤</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <p className="text-gray-500 text-sm mt-1">Upload a new profile picture</p>
                  </div>
                </div>
              </div>

              {/* Name and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                  <input 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-3 pl-8 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Choose a unique username"
                  />
                </div>
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                <p className="text-gray-500 text-sm mt-1">Username must be 3-30 characters, letters, numbers, dots, and underscores only</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
              </div>

              <div className="mt-6">
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
            </div>

            {/* Professional Links */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Professional Links</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile URL</label>
                <input 
                  name="linkedin" 
                  value={formData.linkedin} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>
            </div>

            {/* Coding Platform Usernames */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Coding Platform Usernames</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg text-sm ${
                message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {message}
              </div>
            )}

            {/* Save Changes Button */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile; 