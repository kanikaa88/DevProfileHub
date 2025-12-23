import React, { useState } from "react";

function AddStats({ profileData, onSave, onCancel, onBack }) {
  const [formData, setFormData] = useState({
    github: profileData?.github || "",
    leetcode: profileData?.leetcode || "",
    codeforces: profileData?.codeforces || "",
    hackerrank: profileData?.hackerrank || ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage("");
      
      // Call the onSave function with updated data
      await onSave(formData);
      setMessage("Stats updated successfully!");
      
      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      setMessage("Failed to update stats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              <h1 className="text-3xl font-bold text-purple-700">Add More Stats</h1>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 mt-2">Add your coding platform usernames to see your statistics on the dashboard</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Coding Platforms */}
            <div>
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Coding Platforms</h2>
              <p className="text-gray-600 mb-6">Enter your usernames for the platforms you want to track. Leave empty if you don't want to track a particular platform.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GitHub */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">📦</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">GitHub</h3>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">github.com/</span>
                    <input
                      type="text"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="your-username"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Your GitHub username (without @)</p>
                </div>

                {/* LeetCode */}
                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">💻</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">LeetCode</h3>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">leetcode.com/</span>
                    <input
                      type="text"
                      name="leetcode"
                      value={formData.leetcode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="your-username"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Your LeetCode username</p>
                </div>

                {/* Codeforces */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">🏆</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Codeforces</h3>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">codeforces.com/profile/</span>
                    <input
                      type="text"
                      name="codeforces"
                      value={formData.codeforces}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="your-handle"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Your Codeforces handle</p>
                </div>

                {/* HackerRank */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">💚</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">HackerRank</h3>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">hackerrank.com/</span>
                    <input
                      type="text"
                      name="hackerrank"
                      value={formData.hackerrank}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="your-username"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Your HackerRank username</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <span className="text-blue-600 text-lg mr-3">ℹ️</span>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">How it works</h4>
                  <p className="text-blue-700 text-sm">
                    Once you save your usernames, we'll fetch your statistics from these platforms and display them on your dashboard. 
                    You can always come back here to add or update your usernames.
                  </p>
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

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
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
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Stats"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStats; 