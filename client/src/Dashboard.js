import React, { useEffect, useState } from "react";
import { FaGithub, FaTrophy, FaHackerrank, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

// Inline SVG components for logos
const LeetCodeLogo = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" fill="#FFA116" rx="8"/>
    <text x="32" y="40" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">LC</text>
  </svg>
);

const HackerRankLogo = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" fill="#00EA64" rx="8"/>
    <text x="32" y="40" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">HR</text>
  </svg>
);

const LinkedInLogo = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" fill="#0077B5" rx="8"/>
    <text x="32" y="40" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">LI</text>
  </svg>
);

function Dashboard({ profileData, onEditProfile, darkMode }) {
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [hackerrankData, setHackerrankData] = useState(null);
  const [loading, setLoading] = useState({
    github: false,
    leetcode: false,
    codeforces: false,
    hackerrank: false
  });
  const [errors, setErrors] = useState({});
  const [localProfileData, setLocalProfileData] = useState(profileData);

  // Update local profile data when prop changes
  useEffect(() => {
    setLocalProfileData(profileData);
  }, [profileData]);

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        const updatedProfileData = { ...localProfileData, profilePicture: imageData };
        
        // Update localStorage
        localStorage.setItem("profileData", JSON.stringify(updatedProfileData));
        
        // Update local state
        setLocalProfileData(updatedProfileData);
        
        // Show success message
        alert("Profile picture updated successfully!");
      };
      
      reader.onerror = () => {
        alert("Error reading file. Please try again.");
      };
      
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (localProfileData.github) {
        setLoading(prev => ({ ...prev, github: true }));
        try {
          const response = await fetch(`http://localhost:8080/api/users/stats/github?username=${localProfileData.github}`);
          if (!response.ok) throw new Error('Failed to fetch GitHub data');
          const data = await response.json();
          setGithubData(data);
        } catch (err) {
          console.error("GitHub error:", err);
          setErrors(prev => ({ ...prev, github: "Failed to load GitHub data" }));
        } finally {
          setLoading(prev => ({ ...prev, github: false }));
        }
      }

      if (localProfileData.leetcode) {
        setLoading(prev => ({ ...prev, leetcode: true }));
        try {
          const response = await fetch(`http://localhost:8080/api/users/stats/leetcode?username=${localProfileData.leetcode}`);
          if (!response.ok) throw new Error('Failed to fetch LeetCode data');
          const data = await response.json();
          setLeetcodeData(data);
        } catch (err) {
          console.error("LeetCode error:", err);
          setErrors(prev => ({ ...prev, leetcode: "Failed to load LeetCode data" }));
        } finally {
          setLoading(prev => ({ ...prev, leetcode: false }));
        }
      }

      if (localProfileData.codeforces) {
        setLoading(prev => ({ ...prev, codeforces: true }));
        try {
          const response = await fetch(`http://localhost:8080/api/users/stats/codeforces?username=${localProfileData.codeforces}`);
          if (!response.ok) throw new Error('Failed to fetch Codeforces data');
          const data = await response.json();
          setCodeforcesData(data);
        } catch (err) {
          console.error("Codeforces error:", err);
          setErrors(prev => ({ ...prev, codeforces: "Failed to load Codeforces data" }));
        } finally {
          setLoading(prev => ({ ...prev, codeforces: false }));
        }
      }

      if (localProfileData.hackerrank) {
        setLoading(prev => ({ ...prev, hackerrank: true }));
        try {
          const response = await fetch(`http://localhost:8080/api/users/stats/hackerrank?username=${localProfileData.hackerrank}`);
          if (!response.ok) throw new Error('Failed to fetch HackerRank data');
          const data = await response.json();
          setHackerrankData(data);
        } catch (err) {
          console.error("HackerRank error:", err);
          setErrors(prev => ({ ...prev, hackerrank: "Failed to load HackerRank data" }));
        } finally {
          setLoading(prev => ({ ...prev, hackerrank: false }));
        }
      }
    };

    fetchData();
  }, [localProfileData]);

  const StatCard = ({ title, icon, color, children, loading, error, data, avatarUrl }) => {
    if (loading) {
      return (
        <div className="card p-6 rounded-xl shadow-lg border-l-4 border-gray-300">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse mr-3"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse flex-1"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="card p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <div className="flex items-center mb-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-red-100`}>
              <span className="text-red-600 text-lg">{icon}</span>
            </div>
            <h2 className={`text-lg font-semibold text-red-600`}>{title}</h2>
          </div>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      );
    }

    if (!data) {
      return null;
    }

    return (
      <div className={`card p-6 rounded-xl shadow-lg border-l-4 ${color} flex items-center justify-between`}>
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-opacity-10 ${color.replace('border-', 'bg-')}`}>{icon}</div>
            <h2 className={`text-lg font-semibold ${color.replace('border-', 'text-')}`}>{title}</h2>
          </div>
          <div className="font-sans">
            {children}
          </div>
        </div>
        {avatarUrl && (
          <div className="w-16 h-16 rounded-full border-2 ml-4 overflow-hidden flex-shrink-0" style={{borderColor: darkMode ? '#444' : '#e5e7eb'}}>
            {typeof avatarUrl === 'string' ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {avatarUrl}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Helper to get LinkedIn profile pic (fallback to logo)
  const getLinkedInAvatar = () => {
    return <LinkedInLogo />;
  };

  // Helper to get LeetCode avatar (use real avatar if available, otherwise fallback)
  const getLeetCodeAvatar = () => {
    if (leetcodeData?.avatar) return leetcodeData.avatar;
    return <LeetCodeLogo />;
  };

  // Helper to get HackerRank avatar (use scraped or fallback)
  const getHackerRankAvatar = () => {
    if (hackerrankData?.avatar) return hackerrankData.avatar;
    return <HackerRankLogo />;
  };

  return (
    <div className="space-y-6">
      {/* Top Section - Name/Contact on left, LinkedIn on right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side - Personal Info */}
        <div className="card p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4 overflow-hidden cursor-pointer hover:bg-purple-200 transition-colors" onClick={() => document.getElementById('profilePictureInput').click()}>
              {localProfileData?.profilePicture ? (
                <img 
                  src={localProfileData.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#374151'}}>
                {localProfileData?.firstName} {localProfileData?.lastName}
              </h2>
              <p className="transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>{localProfileData?.email}</p>
              <p className="transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>{localProfileData?.contact}</p>
            </div>
          </div>
          <div>
            <p className="text-sm mb-1 transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Address</p>
            <p className="transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#1f2937'}}>{localProfileData?.address}</p>
          </div>
          <input 
            type="file" 
            id="profilePictureInput" 
            accept="image/*" 
            className="hidden" 
            onChange={handleProfilePictureUpload}
          />
        </div>

        {/* Right Side - LinkedIn */}
        <div className="card p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          {localProfileData?.linkedin ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaLinkedin className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#1f2937'}}>LinkedIn</h2>
                  <p className="transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>{localProfileData.firstName} {localProfileData.lastName}</p>
                </div>
              </div>
              <a 
                href={localProfileData.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View Profile
              </a>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaLinkedin className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-lg font-semibold mb-2 transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#1f2937'}}>LinkedIn</h2>
              <p className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Add your LinkedIn profile to see it here</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GitHub */}
        <StatCard 
          title="GitHub" 
          icon={<FaGithub className="text-gray-700" />} 
          color="border-gray-600" 
          loading={loading.github}
          error={errors.github}
          data={githubData}
          avatarUrl={githubData?.avatarUrl}
        >
          <div className="space-y-3">
            <p>
              <a 
                href={githubData?.profileUrl} 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {githubData?.username || 'GitHub User'}
              </a>
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <p className="font-bold transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#1f2937'}}>{githubData?.publicRepos || 0}</p>
                <p className="text-xs transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Repos</p>
              </div>
              <div className="text-center">
                <p className="font-bold transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#1f2937'}}>{githubData?.followers || 0}</p>
                <p className="text-xs transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#1f2937'}}>{githubData?.following || 0}</p>
                <p className="text-xs transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Following</p>
              </div>
            </div>
            {githubData?.bio && (
              <p className="text-sm italic line-clamp-2 transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>"{githubData.bio}"</p>
            )}
          </div>
        </StatCard>
        {/* LeetCode */}
        <StatCard 
          title="LeetCode" 
          icon={<SiLeetcode className="text-orange-500" />} 
          color="border-orange-600" 
          loading={loading.leetcode}
          error={errors.leetcode}
          data={leetcodeData}
          avatarUrl={getLeetCodeAvatar()}
        >
          <div className="space-y-3">
            <p>
              <a 
                href={`https://leetcode.com/${localProfileData.leetcode}`} 
                className="text-orange-600 hover:text-orange-800 font-medium transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {localProfileData.leetcode}
              </a>
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="font-bold transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#1f2937'}}>{leetcodeData?.totalSolved || 0}</p>
                <p className="transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Total Solved</p>
              </div>
              <div className="text-center">
                <p className="font-bold transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#1f2937'}}>{leetcodeData?.ranking || 'N/A'}</p>
                <p className="transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Ranking</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Easy</span>
                <span className="text-green-600 font-medium">{leetcodeData?.easySolved || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Medium</span>
                <span className="text-yellow-600 font-medium">{leetcodeData?.mediumSolved || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Hard</span>
                <span className="text-red-600 font-medium">{leetcodeData?.hardSolved || 0}</span>
              </div>
            </div>
          </div>
        </StatCard>
        {/* Codeforces */}
        <StatCard 
          title="Codeforces" 
          icon={<FaTrophy className="text-purple-700" />} 
          color="border-purple-600" 
          loading={loading.codeforces}
          error={errors.codeforces}
          data={codeforcesData}
          avatarUrl={codeforcesData?.avatar}
        >
          <div className="space-y-3">
            <p>
              <a 
                href={`https://codeforces.com/profile/${codeforcesData?.handle || localProfileData.codeforces}`} 
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {codeforcesData?.handle || localProfileData.codeforces}
              </a>
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Rating</span>
                <span className="font-medium text-purple-600">{codeforcesData?.rating || 'Unrated'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Max Rating</span>
                <span className="font-medium text-purple-600">{codeforcesData?.maxRating || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Rank</span>
                <span className="font-medium text-purple-600">{codeforcesData?.rank || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Contribution</span>
                <span className="font-medium text-purple-600">{codeforcesData?.contribution || 0}</span>
              </div>
            </div>
          </div>
        </StatCard>
        {/* HackerRank */}
        <StatCard 
          title="HackerRank" 
          icon={<FaHackerrank className="text-green-600" />} 
          color="border-green-600" 
          loading={loading.hackerrank}
          error={errors.hackerrank}
          data={hackerrankData}
          avatarUrl={getHackerRankAvatar()}
        >
          <div className="space-y-3">
            <p>
              <a 
                href={hackerrankData?.profileUrl || `https://www.hackerrank.com/${localProfileData.hackerrank}`} 
                className="text-green-600 hover:text-green-800 font-medium transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {hackerrankData?.username || localProfileData.hackerrank}
              </a>
            </p>
            {hackerrankData?.location && (
              <p className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>📍 {hackerrankData.location}</p>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              <div className="text-center">
                <p className="font-bold transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#1f2937'}}>{hackerrankData?.totalSolved || 0}</p>
                <p className="transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Total Solved</p>
              </div>
              <div className="text-center">
                <p className="font-bold transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#1f2937'}}>{hackerrankData?.rank || 'N/A'}</p>
                <p className="transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Rank</p>
              </div>
            </div>
          </div>
        </StatCard>
      </div>
      {/* Empty State */}
      {!loading.github && !loading.leetcode && !loading.codeforces && !loading.hackerrank &&
       !githubData && !leetcodeData && !codeforcesData && !hackerrankData && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2 transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#374151'}}>No Coding Platform Data</h3>
          <p className="mb-4 transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>Add your coding platform usernames to see your stats here.</p>
          <div className="card p-4 rounded-lg max-w-md mx-auto mb-6" style={{background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff', borderColor: darkMode ? '#3b82f6' : '#dbeafe'}}>
            <p className="text-sm transition-colors duration-300" style={{color: darkMode ? '#93c5fd' : '#1d4ed8'}}>
              <strong>Tip:</strong> You can add your GitHub, LeetCode, Codeforces, and HackerRank usernames 
              in your profile settings to see your coding statistics here.
            </p>
          </div>
          <p className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>
            Use the menu in the top right to add your coding platform usernames.
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
