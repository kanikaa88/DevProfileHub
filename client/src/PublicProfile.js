import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeatmapComponent from "./HeatmapComponent";

function PublicProfile() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    github: null,
    leetcode: null,
    codeforces: null,
    hackerrank: null
  });

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`http://localhost:8080/api/users/public/${username}`);
      
      if (response.ok) {
        const result = await response.json();
        setProfileData(result.data);
        
        // Fetch stats for each platform
        await fetchStats(result.data);
      } else if (response.status === 404) {
        setError("Profile not found");
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (profile) => {
    const statsPromises = [];
    
    if (profile.github) {
      statsPromises.push(
        fetch(`http://localhost:8080/api/users/stats/github?username=${profile.github}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => ({ platform: 'github', data }))
          .catch(() => ({ platform: 'github', data: null }))
      );
    }
    
    if (profile.leetcode) {
      statsPromises.push(
        fetch(`http://localhost:8080/api/users/stats/leetcode?username=${profile.leetcode}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => ({ platform: 'leetcode', data }))
          .catch(() => ({ platform: 'leetcode', data: null }))
      );
    }
    
    if (profile.codeforces) {
      statsPromises.push(
        fetch(`http://localhost:8080/api/users/stats/codeforces?username=${profile.codeforces}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => ({ platform: 'codeforces', data }))
          .catch(() => ({ platform: 'codeforces', data: null }))
      );
    }
    
    if (profile.hackerrank) {
      statsPromises.push(
        fetch(`http://localhost:8080/api/users/stats/hackerrank?username=${profile.hackerrank}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => ({ platform: 'hackerrank', data }))
          .catch(() => ({ platform: 'hackerrank', data: null }))
      );
    }

    const results = await Promise.all(statsPromises);
    const newStats = {};
    results.forEach(({ platform, data }) => {
      newStats[platform] = data;
    });
    setStats(newStats);
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Profile link copied to clipboard!");
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                {profileData.profilePicture ? (
                  <img 
                    src={profileData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-purple-700">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-gray-600">@{profileData.username}</p>
                <p className="text-sm text-gray-500">{profileData.email}</p>
              </div>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              📋 Share Profile
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-800">{profileData.contact}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-gray-800">{profileData.address}</p>
            </div>
            {profileData.linkedin && (
              <div>
                <p className="text-sm text-gray-500">LinkedIn</p>
                <a 
                  href={profileData.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profileData.linkedin}
                </a>
              </div>
            )}
            {profileData.resumeUrl && (
              <div>
                <p className="text-sm text-gray-500">Resume</p>
                <a 
                  href={`http://localhost:8080${profileData.resumeUrl}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline flex items-center gap-2"
                >
                  📄 Download Resume
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Projects */}
        {profileData.projects && profileData.projects.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileData.projects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {project.points && project.points.length > 0 && (
                    <ul className="mb-3 text-sm text-gray-600">
                      {project.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {project.links && (project.links.github || project.links.live || project.links.demo) && (
                    <div className="flex gap-2">
                      {project.links.github && (
                        <a 
                          href={project.links.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          GitHub
                        </a>
                      )}
                      {project.links.live && (
                        <a 
                          href={project.links.live} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline text-sm"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.links.demo && (
                        <a 
                          href={project.links.demo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline text-sm"
                        >
                          Other
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Coding Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* GitHub */}
          {profileData.github && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">📦</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">GitHub</h3>
              </div>
              <a 
                href={`https://github.com/${profileData.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                @{profileData.github}
              </a>
              {stats.github && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>Repositories: {stats.github.public_repos || 'N/A'}</p>
                  <p>Followers: {stats.github.followers || 'N/A'}</p>
                </div>
              )}
              
              {/* GitHub Heatmap */}
              {stats.github?.contributionData && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <HeatmapComponent
                    type="github"
                    data={stats.github.contributionData}
                    totalContributions={stats.github.totalContributions}
                  />
                </div>
              )}
            </div>
          )}

          {/* LeetCode */}
          {profileData.leetcode && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">💻</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">LeetCode</h3>
              </div>
              <a 
                href={`https://leetcode.com/${profileData.leetcode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                @{profileData.leetcode}
              </a>
              {stats.leetcode && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>Problems Solved: {stats.leetcode.totalSolved || 'N/A'}</p>
                  <p>Rank: {stats.leetcode.ranking || 'N/A'}</p>
                </div>
              )}
              
              {/* LeetCode Heatmap */}
              {stats.leetcode?.submissionData && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <HeatmapComponent
                    type="leetcode"
                    data={stats.leetcode.submissionData}
                    totalSubmissions={stats.leetcode.totalSubmissions}
                  />
                </div>
              )}
            </div>
          )}

          {/* Codeforces */}
          {profileData.codeforces && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">🏆</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Codeforces</h3>
              </div>
              <a 
                href={`https://codeforces.com/profile/${profileData.codeforces}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                @{profileData.codeforces}
              </a>
              {stats.codeforces && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>Rating: {stats.codeforces.rating || 'N/A'}</p>
                  <p>Rank: {stats.codeforces.rank || 'N/A'}</p>
                </div>
              )}
            </div>
          )}

          {/* HackerRank */}
          {profileData.hackerrank && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">💚</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">HackerRank</h3>
              </div>
              <a 
                href={`https://hackerrank.com/${profileData.hackerrank}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                @{profileData.hackerrank}
              </a>
              {stats.hackerrank && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>Badges: {stats.hackerrank.badges || 'N/A'}</p>
                  <p>Score: {stats.hackerrank.score || 'N/A'}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Powered by DevProfile Hub</p>
          <button
            onClick={() => window.location.href = '/'}
            className="text-purple-600 hover:underline mt-2"
          >
            Create your own profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicProfile;
