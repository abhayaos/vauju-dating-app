import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import { validateToken, decodeJWT } from "../utils/auth";
import { getProfileImage, handleImageError, validateImageFile } from "../utils/imageUtils";
import { useAuth } from "../context/AuthContext";

const BASE_API = "https://backend-vauju-1.onrender.com/api";

// Skeleton component for profile loading state
const ProfileSkeleton = () => (
  <div className="min-h-screen flex flex-col items-center pt-14 pb-8 px-5 bg-gray-50">
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Profile picture skeleton */}
      <div className="relative mb-4">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-200 animate-pulse"></div>
      </div>

      {/* Name skeleton */}
      <div className="h-8 bg-gray-200 rounded-full w-40 mb-2 animate-pulse"></div>

      {/* Username skeleton */}
      <div className="h-4 bg-gray-200 rounded-full w-24 mb-5 animate-pulse"></div>

      {/* Bio skeleton */}
      <div className="h-4 bg-gray-200 rounded-full w-64 mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded-full w-56 mb-6 animate-pulse"></div>

      {/* Stats skeleton */}
      <div className="flex justify-center gap-10 mb-5 w-full">
        <div className="text-center">
          <div className="h-6 bg-gray-200 rounded-full w-8 mx-auto mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded-full w-12 mx-auto animate-pulse"></div>
        </div>
        <div className="text-center">
          <div className="h-6 bg-gray-200 rounded-full w-8 mx-auto mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded-full w-12 mx-auto animate-pulse"></div>
        </div>
        <div className="text-center">
          <div className="h-6 bg-gray-200 rounded-full w-8 mx-auto mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded-full w-12 mx-auto animate-pulse"></div>
        </div>
      </div>

      {/* Buttons skeleton */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-xs">
        <div className="h-10 bg-gray-200 rounded-full animate-pulse flex-1"></div>
        <div className="h-10 bg-gray-200 rounded-full animate-pulse flex-1"></div>
      </div>
    </div>
  </div>
);

function Profile() {
  const [user, setUser] = useState(null);
  const [suspended, setSuspended] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { username, id } = useParams();
  const { token, user: authUser } = useAuth();

  const payload = token ? decodeJWT(token) : null;
  const currentUserId = payload?._id || authUser?._id;

  const safeDecode = (value) => {
    if (typeof value !== "string") return value;
    try {
      return decodeURIComponent(value);
    } catch (err) {
      console.warn("Failed to decode value", value, err);
      return value;
    }
  };

  const decodedUsername = username ? safeDecode(username) : "";

  // Attempt to refresh token if expired
  const refreshToken = async () => {
    try {
      const res = await fetch(`${BASE_API}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // If backend uses cookies for refresh tokens
      });
      if (res.ok) {
        const { token } = await res.json();
        console.log("Token refreshed successfully");
        return token;
      }
      throw new Error("Token refresh failed");
    } catch (err) {
      console.error("Token refresh error:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true); // Set loading to true when starting fetch
        let url = "";
        let headers = {};
        let profileData = null;

        if (decodedUsername) {
          url = `${BASE_API}/users/username/${encodeURIComponent(decodedUsername)}`;
          setIsOwnProfile(false);
        } else if (id) {
          // Public profile view by ID
          console.log("Fetching profile for ID:", id);
          url = `${BASE_API}/users/${encodeURIComponent(id)}`;
          setIsOwnProfile(false);
        } else {
          // Own profile view
          if (!token) {
            console.warn("No token found, redirecting to login");
            toast.error("Please log in to view your profile");
            navigate("/login", { replace: true });
            return;
          }

          if (!validateToken(token)) {
            console.warn("Invalid or expired token, attempting refresh");
            const newToken = await refreshToken();
            if (!newToken) {
              toast.error("Session expired. Please log in again.");
              clearAuthData();
              navigate("/login", { replace: true });
              return;
            }
          }

          if (!currentUserId) {
            console.warn("No user ID in token, attempting refresh");
            const newToken = await refreshToken();
            if (!newToken || !decodeJWT(newToken)?._id) {
              toast.error("Invalid session. Please log in again.");
              clearAuthData();
              navigate("/login", { replace: true });
              return;
            }
          }

          headers = { Authorization: `Bearer ${token}` };
          url = `${BASE_API}/profile/me`;
          setIsOwnProfile(true);
        }

        console.log(`Fetching from: ${url}`);
        const res = await fetch(url, { headers });

        if (!res.ok) {
          if (res.status === 401 && isOwnProfile) {
            console.warn("401 Unauthorized, attempting token refresh");
            const newToken = await refreshToken();
            if (newToken) {
              const retryRes = await fetch(url, {
                headers: { Authorization: `Bearer ${newToken}` },
              });
              if (retryRes.ok) {
                profileData = await retryRes.json();
              } else {
                throw new Error("Retry failed after token refresh");
              }
            } else {
              toast.error("Session expired. Please log in again.");
              clearAuthData();
              navigate("/login", { replace: true });
              return;
            }
          } else if (res.status === 404) {
            console.error("Profile not found");
            setNotFound(true);
            toast.error("Profile not found");
            return;
          } else {
            throw new Error(`Server error: ${res.status}`);
          }
        }

        profileData = await res.json();
        console.log("Success! Profile data:", profileData);

        setUser(profileData);

        if (profileData?.suspended) {
          setSuspended(true);
          if (isOwnProfile) {
            toast.error("Your account is suspended. Please contact support.");
            // Don't auto-logout; let user see the message
          }
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        toast.error("Failed to load profile: " + (err.message || "unknown"));
        setNotFound(true);
      } finally {
        setLoading(false); // Set loading to false when fetch completes
      }
    };

    fetchProfile();
  }, [navigate, token, currentUserId, username, id]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setUser((prev) => ({ ...prev, profilePic: reader.result }));
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      let currentToken = token;
      if (!currentToken || !validateToken(currentToken)) {
        currentToken = await refreshToken();
        if (!currentToken) {
          toast.error("Session expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }
      }

      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await fetch(`${BASE_API}/profile/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${currentToken}` },
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.warn("401 Unauthorized during upload, attempting refresh");
          currentToken = await refreshToken();
          if (currentToken) {
            const retryRes = await fetch(`${BASE_API}/profile/upload`, {
              method: "POST",
              headers: { Authorization: `Bearer ${currentToken}` },
              body: formData,
            });
            if (retryRes.ok) {
              const data = await retryRes.json();
              setUser((prev) => ({ ...prev, profilePic: data.url }));
              toast.success("Profile picture updated!");
              setUploading(false);
              return;
            }
          }
          toast.error("Session expired. Please log in again.");
          clearAuthData();
          navigate("/login", { replace: true });
          return;
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to upload profile picture");
      }

      const data = await res.json();
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
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg bg-gray-50">
        Profile not found 😕
      </div>
    );
  }

  // Show skeleton loader when loading
  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-14 pb-8 px-5 bg-gray-50">
      <Toaster position="top-center" />

      {suspended && (
        <div className="w-full max-w-md text-center text-red-600 bg-red-50 py-3 rounded-md mb-4">
          Your account is suspended 😔. Please contact support.
        </div>
      )}

      <div className="relative mb-4">
        <img
          src={getProfileImage(user)}
          alt="Profile"
          className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-blue-200 object-cover cursor-pointer ${
            uploading ? "opacity-50" : ""
          }`}
          onClick={() => isOwnProfile && document.getElementById("profilePicInput").click()}
          onError={(e) => handleImageError(e, user.gender)}
        />
        {isOwnProfile && (
          <input
            type="file"
            id="profilePicInput"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicChange}
          />
        )}
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
        <p className="text-gray-700 text-center text-sm sm:text-base mb-6 max-w-md">{user.bio}</p>
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
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => {
                clearAuthData();
                navigate("/login", { replace: true });
              }}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate(`/messages/${user._id}`)}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition"
            >
              Message
            </button>
            <button
              onClick={() => navigate("/matches")}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition"
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