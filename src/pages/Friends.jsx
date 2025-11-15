import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, UserPlus, MessageCircle, MapPin, Users, Heart, Sparkles, UserCheck, Clock, UserX, Star } from "lucide-react";
import { getProfileImage, handleImageError } from "../utils/imageUtils";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5005';

function Friends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("friends"); // friends, requests, suggestions, daily
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [dailySuggestion, setDailySuggestion] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();

  // Fetch friends data
  const fetchFriendsData = useCallback(async (attempt = 1) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      
      // Fetch friends and friend requests from the new API
      const response = await fetch(`${API_BASE}/friends`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to fetch friends data: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      
      setFriends(data.friends || []);
      setFriendRequests(data.friendRequests || []);
      
      // For suggestions, we'll still use the users endpoint but filter out friends
      const usersResponse = await fetch(`${API_BASE}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        const allUsers = Array.isArray(usersData) ? usersData : usersData.users || [];
        
        // Filter out current user, friends, and users who sent friend requests
        const friendIds = (data.friends || []).map(f => f._id);
        const requestIds = (data.friendRequests || []).map(r => r._id);
        
        const filteredSuggestions = allUsers.filter(user => 
          user && user._id && 
          user._id !== currentUser._id &&
          !friendIds.includes(user._id) &&
          !requestIds.includes(user._id)
        );
        
        setSuggestions(filteredSuggestions);
      }
      
      // Reset retry count on success
      setRetryCount(0);
    } catch (err) {
      console.error("Error fetching friends data:", err);
      
      // Retry logic with exponential backoff
      if (attempt < 3) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        setTimeout(() => {
          fetchFriendsData(attempt + 1);
        }, delay);
        setRetryCount(attempt);
      } else {
        toast.error(`Failed to load friends data after multiple attempts: ${err.message}`);
        // Fallback to mock data if all retries fail
        const mockFriends = [
          {
            _id: "1",
            name: "Alex Johnson",
            username: "alexj",
            bio: "Love hiking and photography. Looking for meaningful connections.",
            location: "New York, NY",
            interests: ["Photography", "Hiking", "Coffee"],
            isOnline: true,
            mutualFriends: 12
          },
          {
            _id: "2",
            name: "Sam Wilson",
            username: "samw",
            bio: "Foodie and traveler. Always up for trying new cuisines!",
            location: "Los Angeles, CA",
            interests: ["Travel", "Food", "Music"],
            isOnline: false,
            mutualFriends: 8
          }
        ];
        setFriends(mockFriends);
        setFriendRequests([]);
        setSuggestions(mockFriends);
        setRetryCount(0);
      }
    } finally {
      if (retryCount >= 2 || !loading) {
        setLoading(false);
      }
    }
  }, [token, navigate, retryCount, loading, currentUser]);

  // Fetch daily suggestion
  const fetchDailySuggestion = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/friends/daily-suggestion`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDailySuggestion(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch daily suggestion:", response.status, errorData.message || response.statusText);
        // Don't show error to user for daily suggestion as it's optional
        setDailySuggestion(null);
      }
    } catch (err) {
      console.error("Error fetching daily suggestion:", err);
      // Don't show error to user for daily suggestion as it's optional
      setDailySuggestion(null);
    }
  }, [token]);

  // Fetch data on component mount and set up refresh interval
  useEffect(() => {
    fetchFriendsData();
    fetchDailySuggestion();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchFriendsData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchFriendsData, fetchDailySuggestion]);

  // Filter friends based on search query
  const filteredFriends = useMemo(() => {
    if (!searchQuery) return friends;
    const query = searchQuery.toLowerCase();
    return friends.filter(friend => 
      friend.name.toLowerCase().includes(query) || 
      (friend.username && friend.username.toLowerCase().includes(query)) ||
      (friend.interests && friend.interests.some(interest => 
        interest && interest.toLowerCase().includes(query)))
    );
  }, [friends, searchQuery]);

  // Filter suggestions based on search query
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return suggestions;
    const query = searchQuery.toLowerCase();
    return suggestions.filter(user => 
      user.name.toLowerCase().includes(query) || 
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.interests && user.interests.some(interest => 
        interest && interest.toLowerCase().includes(query)))
    );
  }, [suggestions, searchQuery]);

  // Handle friend request
  const handleFriendRequest = async (userId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/friends/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send friend request');
      }
      
      toast.success("Friend request sent!");
      // Refresh the data
      fetchFriendsData();
    } catch (err) {
      console.error("Error sending friend request:", err);
      toast.error(err.message || "Failed to send friend request");
    }
  };

  // Handle accept friend request
  const handleAcceptRequest = async (userId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/friends/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept friend request');
      }
      
      toast.success("Friend request accepted!");
      // Refresh the data
      fetchFriendsData();
    } catch (err) {
      console.error("Error accepting friend request:", err);
      toast.error(err.message || "Failed to accept friend request");
    }
  };

  // Handle reject friend request
  const handleRejectRequest = async (userId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/friends/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject friend request');
      }
      
      toast.success("Friend request rejected");
      // Refresh the data
      fetchFriendsData();
    } catch (err) {
      console.error("Error rejecting friend request:", err);
      toast.error(err.message || "Failed to reject friend request");
    }
  };

  // Handle remove friend
  const handleRemoveFriend = async (userId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/friends/remove`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove friend');
      }
      
      toast.success("Friend removed");
      // Refresh the data
      fetchFriendsData();
    } catch (err) {
      console.error("Error removing friend:", err);
      toast.error(err.message || "Failed to remove friend");
    }
  };

  // Skeleton loading component
  const SkeletonCard = ({ index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-5"
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded-lg w-1/2 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded-lg w-2/3 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );

  // Friend card component
  const FriendCard = ({ friend, type = "friend" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={getProfileImage(friend)}
              alt={friend.name}
              className="h-16 w-16 rounded-full object-cover border-2 border-white shadow"
              onError={(e) => handleImageError(e, friend.gender)}
            />
            {friend.isOnline && (
              <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 truncate">{friend.name}</h3>
              {friend.isOnline && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
              )}
            </div>
            {friend.username && (
              <p className="text-sm text-gray-500 truncate">@{friend.username}</p>
            )}
            
            {friend.bio && (
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">{friend.bio}</p>
            )}
            
            {friend.location && (
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{friend.location}</span>
              </div>
            )}
            
            {friend.interests && friend.interests.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {friend.interests.slice(0, 3).map((interest, idx) => (
                  interest && (
                    <span 
                      key={idx} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800"
                    >
                      {interest}
                    </span>
                  )
                ))}
                {friend.interests.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{friend.interests.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {friend.mutualFriends && (
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{friend.mutualFriends} mutual friends</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          {type === "friend" && (
            <>
              <button
                onClick={() => navigate(`/messages/${friend._id}`)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">Message</span>
              </button>
              <button
                onClick={() => handleRemoveFriend(friend._id)}
                className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Remove
              </button>
            </>
          )}
          
          {type === "request" && (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => handleAcceptRequest(friend._id)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm"
              >
                <UserCheck className="h-4 w-4" />
                <span className="font-medium">Accept</span>
              </button>
              <button
                onClick={() => handleRejectRequest(friend._id)}
                className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <UserX className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {type === "suggestion" && (
            <button
              onClick={() => handleFriendRequest(friend._id)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              <span className="font-medium">Add Friend</span>
            </button>
          )}
          
          {type === "daily" && (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => handleFriendRequest(friend._id)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm"
              >
                <Star className="h-4 w-4" />
                <span className="font-medium">Add Friend</span>
              </button>
              <button
                onClick={() => navigate(`/messages/${friend._id}`)}
                className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (loading && retryCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-12">
        <Toaster position="top-center" reverseOrder={false} />
        
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                Friends
              </h1>
              
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 flex-1 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Search */}
        <div className="max-w-4xl mx-auto px-4 pb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-12">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              Friends
            </h1>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={getProfileImage(currentUser)}
                  alt={currentUser?.name || "User"}
                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow"
                  onError={(e) => handleImageError(e, currentUser?.gender)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{friends.length}</div>
                <div className="text-sm opacity-90">Friends</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{friendRequests.length}</div>
                <div className="text-sm opacity-90">Requests</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{suggestions.length}</div>
                <div className="text-sm opacity-90">Suggestions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Retry message if needed */}
      {retryCount > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg text-center">
            <p>Having trouble loading data... Retrying attempt {retryCount} of 3</p>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === "friends"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              <span>Friends</span>
              {friends.length > 0 && (
                <span className="bg-white bg-opacity-20 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {friends.length}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Requests</span>
              {friendRequests.length > 0 && (
                <span className="bg-white bg-opacity-20 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {friendRequests.length}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === "suggestions"
                ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Suggestions</span>
            </div>
          </button>
          
          <button
            onClick={() => {
              setActiveTab("daily");
              fetchDailySuggestion();
            }}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === "daily"
                ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Star className="h-4 w-4" />
              <span>Daily</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3.5 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4">
        {activeTab === "friends" && (
          <>
            {filteredFriends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredFriends.map((friend) => (
                  <FriendCard key={friend._id} friend={friend} type="friend" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No friends found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery ? "Try a different search term" : "Add some friends to get started"}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </>
        )}
        
        {activeTab === "requests" && (
          <>
            {friendRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {friendRequests.map((request) => (
                  <FriendCard key={request._id} friend={request} type="request" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <UserPlus className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No friend requests</h3>
                <p className="text-gray-500">You don't have any pending friend requests</p>
              </div>
            )}
          </>
        )}
        
        {activeTab === "suggestions" && (
          <>
            {filteredSuggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredSuggestions.map((suggestion) => (
                  <FriendCard key={suggestion._id} friend={suggestion} type="suggestion" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No suggestions</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery ? "Try a different search term" : "Check back later for new suggestions"}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </>
        )}
        
        {activeTab === "daily" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">Daily Match Suggestion</h2>
                <span className="ml-auto bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  New daily
                </span>
              </div>
              <p className="text-gray-600 mt-1">Your personalized match suggestion for today</p>
            </div>
            
            {dailySuggestion ? (
              <div className="p-6">
                <FriendCard friend={dailySuggestion} type="daily" />
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No daily suggestion available</h3>
                <p className="text-gray-500">Check back later for your daily match suggestion</p>
                <button
                  onClick={fetchDailySuggestion}
                  className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Friends;