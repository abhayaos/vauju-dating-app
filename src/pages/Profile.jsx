import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [suspended, setSuspended] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));
  const currentUserId = token?._id;
  const BASE_API = "https://backend-vauju-1.onrender.com/api"; 

  const formatTimestamp = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  useEffect(() => {
    if (!token || !currentUserId) {
      toast.error("Please log in");
      return navigate("/login");
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_API}/profile`, {
          headers: { "x-user-id": currentUserId },
          timeout: 10000,
        });
        setUser(res.data);
        if (res.data?.suspended) {
          setSuspended(true);
          toast.error("Your account is suspended. Logging out...");
          setTimeout(() => {
            localStorage.removeItem("token");
            window.dispatchEvent(new Event("authChange"));
            navigate("/login");
          }, 1500);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error(`Failed to load profile: ${err.message}`);
        }
      }
    };

    fetchProfile();
  }, [navigate, currentUserId, token]);

  if (notFound) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-600 text-lg font-medium bg-white p-6 rounded-xl shadow-md">
          Profile not found 😕
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-500 text-lg font-medium animate-pulse flex items-center gap-2">
          <svg className="animate-spin h-6 w-6 text-pink-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 pb-8">
      <Toaster position="top-center" />

      {suspended && (
        <div className="w-11/12 max-w-md mb-4 p-4 text-center bg-red-50 text-red-600 text-sm font-medium rounded-xl shadow-sm">
          Your account is suspended. Logging out... 😔
        </div>
      )}

      <div className="w-11/12 sm:w-96 bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
        {/* Profile Image */}
        <div className="relative mb-4">
          <img
            src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-gray-200 object-cover shadow-sm hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Name & Verified */}
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          {user.isBlueTick && (
            <div className="group relative">
              <CheckCircle size={18} className="text-blue-500" />
              <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded -top-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                Verified
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-500 text-sm mb-4">@{user.username}</p>

        {/* Stats */}
        <div className="flex justify-around w-full mb-4 bg-gray-100 p-3 rounded-xl">
          <div className="text-center">
            <span className="block text-lg font-semibold text-gray-900">{user.postsCount || 0}</span>
            <span className="text-xs text-gray-500">Posts</span>
          </div>
          <div className="text-center">
            <span className="block text-lg font-semibold text-gray-900">{user.likes || 0}</span>
            <span className="text-xs text-gray-500">Likes</span>
          </div>
          <div className="text-center">
            <span className="block text-lg font-semibold text-gray-900">{user.matches || 0}</span>
            <span className="text-xs text-gray-500">Matches</span>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-700 text-center text-sm font-medium mb-4">{user.bio}</p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
          <button
            onClick={() => navigate("/editprofile")}
            className="flex-1 border border-gray-300 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.dispatchEvent(new Event("authChange"));
              navigate("/login");
            }}
            className="flex-1 border border-gray-300 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
