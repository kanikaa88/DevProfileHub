import React, { useState } from "react";

function EditProfile({ profileData, onSave, onCancel, onBack, onMobileVerifyClick }) {
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
    hackerrank: profileData?.hackerrank || "",
    resumeUrl: profileData?.resumeUrl || "",
    projects: profileData?.projects || []
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

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);

        const response = await fetch(`http://localhost:8080/api/users/profile/${profileData.firebaseUid}/resume`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setFormData(prev => ({ ...prev, resumeUrl: result.resumeUrl }));
          setMessage("Resume uploaded successfully!");
        } else {
          throw new Error('Failed to upload resume');
        }
      } catch (error) {
        setMessage("Failed to upload resume. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        title: '',
        description: '',
        tags: [],
        points: [],
        links: { github: '', live: '', demo: '' }
      }]
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateProject = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const updateProjectLinks = (index, linkType, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { 
          ...project, 
          links: { ...project.links, [linkType]: value } 
        } : project
      )
    }));
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
      
      // Save projects separately
      if (formData.projects.length > 0) {
        const projectsResponse = await fetch(`http://localhost:8080/api/users/profile/${profileData.firebaseUid}/projects`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projects: formData.projects }),
        });

        if (!projectsResponse.ok) {
          throw new Error('Failed to save projects');
        }
      }
      
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
              <h1 className="text-3xl font-bold text-purple-700">Your Account</h1>
            </div>
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
                  <div className="flex gap-2">
                    <input 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your email address"
                    />
                    {formData.email && (
                      <button
                        type="button"
                        onClick={() => onMobileVerifyClick && onMobileVerifyClick('email')}
                        className="px-4 py-3 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-all"
                      >
                        Verify
                      </button>
                    )}
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                  <div className="flex gap-2">
                    <input 
                      name="contact" 
                      value={formData.contact} 
                      onChange={handleChange} 
                      className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.contact ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your 10-digit phone number"
                    />
                    {formData.contact && (
                      <button
                        type="button"
                        onClick={() => onMobileVerifyClick && onMobileVerifyClick('mobile')}
                        className="px-4 py-3 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-all"
                      >
                        Verify
                      </button>
                    )}
                  </div>
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

            {/* Resume Upload */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resume</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF only)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  {formData.resumeUrl && (
                    <a 
                      href={`http://localhost:8080${formData.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                    >
                      📄 View Current Resume
                    </a>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-1">Upload your latest resume in PDF format</p>
              </div>
            </div>

            {/* Projects */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Projects</h2>
              
              <div className="space-y-4">
                {formData.projects.map((project, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Project {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updateProject(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter project title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma-separated)</label>
                        <input
                          type="text"
                          value={project.tags?.join(', ') || ''}
                          onChange={(e) => updateProject(index, 'tags', e.target.value.split(',').map(tag => tag.trim()))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows="3"
                        placeholder="Describe your project"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key Points (one per line)</label>
                      <textarea
                        value={project.points?.join('\n') || ''}
                        onChange={(e) => updateProject(index, 'points', e.target.value.split('\n').filter(p => p.trim()))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows="3"
                        placeholder="Implemented user authentication&#10;Built responsive UI&#10;Integrated payment gateway"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Link</label>
                        <input
                          type="url"
                          value={project.links?.github || ''}
                          onChange={(e) => updateProjectLinks(index, 'github', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://github.com/username/repo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo</label>
                        <input
                          type="url"
                          value={project.links?.live || ''}
                          onChange={(e) => updateProjectLinks(index, 'live', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://your-demo.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Other Links</label>
                        <input
                          type="url"
                          value={project.links?.demo || ''}
                          onChange={(e) => updateProjectLinks(index, 'demo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://other-link.com"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addProject}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-all"
                >
                  + Add Project
                </button>
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