import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./login";
import PlatformForm from "./PlatformForm";
import Dashboard from "./Dashboard";
import VerificationPrompt from "./VerificationPrompt";
import EditProfile from "./EditProfile";
import AddStats from "./AddStats";
import { FaMoon, FaSun } from "react-icons/fa";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddStats, setShowAddStats] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Fetch user profile from backend
  const fetchUserProfile = async (firebaseUser) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`http://localhost:8080/api/users/profile/${firebaseUser.uid}`);
      
      if (response.ok) {
        const result = await response.json();
        setProfileData(result.data);
        setIsVerified(result.data.emailVerified || false);
      } else if (response.status === 404) {
        // User doesn't exist in our database yet
        setProfileData(null);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Save profile data to backend
  const saveProfileData = async (data) => {
    try {
      setLoading(true);
      setError("");
      
      const profilePayload = {
        firebaseUid: user.uid,
        email: user.email,
        ...data
      };

      const response = await fetch('http://localhost:8080/api/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profilePayload),
      });

      if (response.ok) {
        const result = await response.json();
        setProfileData(result.data);
        localStorage.setItem("profileData", JSON.stringify(result.data));
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        setUser(currentUser);
        
        // Fetch user profile from backend
        await fetchUserProfile(currentUser);
      } else {
        setUser(null);
        setProfileData(null);
        setIsVerified(false);
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFormSubmit = async (data) => {
    console.log("Form submitted with data:", data);
    const success = await saveProfileData(data);
    if (success) {
      console.log("Profile saved successfully");
      setIsEditing(false);
      // The profileData state will be updated by saveProfileData
      // The component will automatically re-render and show the dashboard
    }
  };

  const handleEditProfile = async (data) => {
    console.log("Edit profile submitted with data:", data);
    const success = await saveProfileData(data);
    if (success) {
      console.log("Profile updated successfully");
      setShowEditProfile(false);
      // Refresh the profile data
      await fetchUserProfile(user);
    }
  };

  const handleAddStats = async (data) => {
    console.log("Add stats submitted with data:", data);
    const success = await saveProfileData(data);
    if (success) {
      console.log("Stats updated successfully");
      setShowAddStats(false);
      // Refresh the profile data
      await fetchUserProfile(user);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setProfileData(null);
      localStorage.removeItem("profileData");
      setIsVerified(false);
      setError("");
    } catch (err) {
      console.error("Sign out error:", err);
      setError("Failed to sign out");
    }
  };

  const handleEmailVerification = async () => {
    if (!user || !profileData) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/users/profile/${user.uid}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setIsVerified(true);
        setProfileData(result.data);
        setShowVerificationPrompt(false);
      } else {
        throw new Error('Failed to verify email');
      }
    } catch (err) {
      console.error("Email verification error:", err);
      setError("Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  // Show OTP screen only when user clicks "Verify"
  if (showVerificationPrompt && profileData?.email) {
    return (
      <VerificationPrompt
        email={profileData.email}
        onVerified={handleEmailVerification}
      />
    );
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Login />;

  if (!profileData || isEditing) {
    return (
      <PlatformForm 
        onSubmit={handleFormSubmit} 
        onVerifyClick={() => setShowVerificationPrompt(true)}
        loading={loading}
        error={error}
        initialData={isEditing ? profileData : (user ? { email: user.email } : null)}
        isEditing={isEditing}
      />
    );
  }

  if (showEditProfile) {
    return (
      <EditProfile
        profileData={profileData}
        onSave={handleEditProfile}
        onCancel={() => setShowEditProfile(false)}
      />
    );
  }

  if (showAddStats) {
    return (
      <AddStats
        profileData={profileData}
        onSave={handleAddStats}
        onCancel={() => setShowAddStats(false)}
      />
    );
  }

  return (
    <div className="min-h-screen transition-all duration-500" style={{background: darkMode ? 'var(--color-bg-dark)' : 'var(--color-bg-light)'}}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 z-30 glass">
          <div className="flex items-center gap-4">
            {/* Fixed Flower Logo */}
            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=100&h=100&fit=crop&crop=center" 
                alt="DevProfile Hub Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#7c3aed'}}>
                🚀 DevProfile Hub
              </h1>
              {profileData?.username && (
                <p className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>
                  @{profileData.username}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Dark mode toggle */}
            <button
              aria-label="Toggle dark mode"
              className="rounded-full p-2 glass hover:scale-110 transition-all duration-300"
              onClick={() => setDarkMode((d) => !d)}
            >
              {darkMode ? <FaSun className="text-yellow-400 text-xl" /> : <FaMoon className="text-purple-700 text-xl" />}
            </button>
            {/* Email verification status */}
            {!isVerified && (
              <button
                onClick={() => setShowVerificationPrompt(true)}
                className="text-sm underline hover:opacity-80 transition-opacity"
                style={{color: darkMode ? '#60a5fa' : '#1d4ed8'}}
              >
                Verify Email
              </button>
            )}
            {/* User menu */}
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                style={{color: darkMode ? 'var(--color-text-dark)' : '#7c3aed'}}
              >
                <span className="text-2xl">☰</span>
                <span className="hidden sm:inline">{user?.displayName || profileData?.firstName}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 card w-48 z-10">
                  <div className="p-3 border-b" style={{borderColor: darkMode ? '#444' : '#e5e7eb'}}>
                    <p className="text-sm" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>{user?.email}</p>
                    {isVerified && (
                      <p className="text-xs text-green-600">✓ Email verified</p>
                    )}
                  </div>
                  <button 
                    className="block w-full text-left px-4 py-2 hover:opacity-80 transition-opacity"
                    style={{color: darkMode ? 'var(--color-text-dark)' : '#374151'}}
                    onClick={() => {
                      setShowEditProfile(true);
                      setMenuOpen(false);
                    }}
                  >
                    Your Account
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 hover:opacity-80 transition-opacity"
                    style={{color: darkMode ? 'var(--color-text-dark)' : '#374151'}}
                    onClick={() => {
                      setShowAddStats(true);
                      setMenuOpen(false);
                    }}
                  >
                    Add More Stats
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 hover:opacity-80 transition-opacity"
                    style={{color: darkMode ? 'var(--color-text-dark)' : '#374151'}}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="card mb-4" style={{background: darkMode ? '#fee2e2' : '#fef2f2', borderColor: darkMode ? '#fca5a5' : '#fecaca'}}>
            <p className="px-4 py-3 text-red-700">{error}</p>
          </div>
        )}

        {/* Welcome message */}
        <div className="text-center mb-6">
          <p className="text-lg transition-colors duration-300" style={{color: darkMode ? 'var(--color-text-dark)' : '#374151'}}>
            Welcome back, <span className="font-semibold">{user?.displayName || profileData?.firstName}</span>!
          </p>
          <p className="text-sm transition-colors duration-300" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>
            Here's your coding profile overview
          </p>
        </div>

        {/* Dashboard */}
        <Dashboard profileData={profileData} darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;
