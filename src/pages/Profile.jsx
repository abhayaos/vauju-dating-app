import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import { validateToken, decodeJWT, clearAuthData } from "../utils/auth";

function Profile() {
  const [user, setUser] = useState(null);
  const [suspended, setSuspended] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const navigate = useNavigate();
  const { username, id } = useParams();

  const token = localStorage.getItem("token");
  const payload = token ? decodeJWT(token) : null;
  const currentUserId = payload?._id;
  const BASE_API = "https://backend-vauju-1.onrender.com//api"; // Use local backend for development

  useEffect(() => {
    const tryFetchProfile = async (url, headers = {}) => {
      console.log(`Trying to fetch from: ${url}`);
      const res = await fetch(url, { headers });
      console.log(`Response status: ${res.status}`);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Success! Profile data:", data);
        return data;
      }
      
      if (res.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      
      return null;
    };

    const fetchProfile = async () => {
      try {
        let possibleUrls = [];
        let headers = {};
        
        // Debug URL parameters
        console.log('URL Params:', { username, id });
        console.log('Current URL:', window.location.pathname);
        
        // Check if viewing someone else's profile by username or ID
        if (username) {
          // Public profile view by username - try different API endpoints
          console.log('Fetching profile for username:', username);
          possibleUrls = [
            `${BASE_API}/users/@${username}`,
            `${BASE_API}/profile/${username}`,
            `${BASE_API}/users/username/${username}`,
            `${BASE_API}/user/${username}`,
            `${BASE_API}/users?username=${username}`,
            `https://backend-vauju-1.onrender.com//@${username}`  // Direct route
          ];
          setIsOwnProfile(false);
        } else if (id) {
          // Public profile view by ID
          console.log('Fetching profile for ID:', id);
          possibleUrls = [
            `${BASE_API}/users/${id}`,
            `${BASE_API}/profile/${id}`,
            `${BASE_API}/user/${id}`
          ];
          setIsOwnProfile(false);
        } else {
          // Own profile view - requires authentication
          if (!token) {
            console.warn("No token found, redirecting to login");
            toast.error("Please log in to view your profile");
            navigate("/login", { replace: true });
            return;
          }
          
          if (!validateToken(token)) {
            console.warn("Invalid or expired token, redirecting to login");
            toast.error("Session expired. Please log in again.");
            clearAuthData();
            navigate("/login", { replace: true });
            return;
          }
          
          if (!currentUserId) {
            console.warn("No user ID found in token, redirecting to login");
            toast.error("Invalid session. Please log in again.");
            clearAuthData();
            navigate("/login", { replace: true });
            return;
          }

          headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-auth-token': token,
            'token': token
          };
          
          possibleUrls = [
            `${BASE_API}/auth/me`,
            `${BASE_API}/users/me`,
            `${BASE_API}/profile/me`,
            `${BASE_API}/user/me`,
            `${BASE_API}/profile`
          ];
          setIsOwnProfile(true);
        }
        
        // Try each URL until one works
        let profileData = null;
        for (const url of possibleUrls) {
          try {
            profileData = await tryFetchProfile(url, headers);
            if (profileData) {
              break;
            }
          } catch (err) {
            if (err.message === 'UNAUTHORIZED') {
              toast.error("Session expired. Please log in again.");
              clearAuthData();
              navigate("/login", { replace: true });
              return;
            }
            // Continue to next URL
          }
        }
        
        if (!profileData) {
          console.error('All profile endpoints failed');
          setNotFound(true);
          toast.error("Profile not found");
          return;
        }

        setUser(profileData);

        if (profileData?.suspended) {
          setSuspended(true);
          if (isOwnProfile) {
            toast.error("Your account is suspended. Logging out...");
            setTimeout(() => {
              localStorage.removeItem("token");
              navigate("/login", { replace: true });
            }, 1500);
          }
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        toast.error("Failed to load profile: " + err.message);
        setNotFound(true);
      }
    };

    fetchProfile();
  }, [navigate, token, currentUserId, username, id]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setUser((prev) => ({ ...prev, profilePic: reader.result }));
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await fetch(`${BASE_API}/profile/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.status === 401) {
        const errorBody = await res.text().catch(() => "No response body");
        console.error("Unauthorized: Session expired during upload", {
          status: res.status,
          statusText: res.statusText,
          response: errorBody,
        });
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload profile picture");
      }

      setUser((prev) => ({ ...prev, profilePic: data.url }));
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  if (notFound) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Profile not found 😕
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-500 animate-pulse">
        <div className="text-center">
          <p className="text-lg mb-2">Loading profile...</p>
          <p className="text-sm text-gray-400">Check the debug panel for more info</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-14 pb-8 px-5 bg-gray-50">
      <Toaster position="top-center" />
      <AuthDebug />
    
      {suspended && (
        <div className="w-full text-center text-red-600 bg-red-50 py-2 rounded-md mb-4">
          Your account is suspended 😔
        </div>
      )}

      <div className="relative mb-4">
        <img
          src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
          alt="Profile"
          className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-gray-200 object-cover cursor-pointer ${
            uploading ? "opacity-50" : ""
          }`}
          onClick={() => document.getElementById("profilePicInput").click()}
        />
        <input
          type="file"
          id="profilePicInput"
          accept="image/*"
          className="hidden"
          onChange={handleProfilePicChange}
        />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">{user.name}</h2>
        {user.isBlueTick && (
          <div className="group relative">
            <CheckCircle size={18} className="text-blue-500" />
            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded -top-7 left-1/2 transform -translate-x-1/2">
              Verified
            </span>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-sm mb-5">@{user.username}</p>
      {user.bio && (
        <p className="text-gray-700 text-center text-sm sm:text-base mb-6">{user.bio}</p>
      )}

      <div className="flex justify-center gap-10 mb-5">
        {["Posts", "Likes", "Matches"].map((label) => (
          <div key={label} className="text-center">
            <p className="text-lg font-semibold text-gray-900">{user[label.toLowerCase()] || 0}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-xs">
        {isOwnProfile ? (
          <>
            <button
              onClick={() => navigate("/editprofile")}
              className="flex-1 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800"
            >
              Edit Profile
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login", { replace: true });
              }}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate(`/messages/${user._id}`)}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700"
            >
              Message
            </button>
            <button
              onClick={() => navigate("/matches")}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300"
            >
              Back to Matches
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;