import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, MessageSquare, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfileImage, handleImageError, getOptimizedCloudinaryUrl, isCloudinaryUrl } from "../utils/imageUtils";

function RandomGirl() {
  const [girl, setGirl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [male, setMale] = useState(false);
  const [GenderReload, setGenderReload] = useState(false);
  const [reloadKey, setReloadKey] = useState(0); // For section-specific reload
  const [showSkeleton, setShowSkeleton] = useState(true); // For skeleton loading

  const navigate = useNavigate();

  // Function to get optimized profile image
  const getOptimizedProfileImage = (user) => {
    const profileImageUrl = getProfileImage(user);
    // Only optimize if it's a Cloudinary URL
    if (isCloudinaryUrl(profileImageUrl)) {
      return getOptimizedCloudinaryUrl(profileImageUrl, {
        quality: 'auto',
        fetch_format: 'auto',
        width: 96,
        height: 96
      });
    }
    return profileImageUrl;
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
    </div>
  );

  const fetchRandomGirl = async () => {
    setLoading(true);
    setShowSkeleton(true);
    
    // Simulate 4 second loading as per requirements
    setTimeout(async () => {
      try {
        const res = await axios.get("https://backend-vauju-1.onrender.com/api/random-girl");
        setGirl(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setShowSkeleton(false);
      }
    }, 4000);
  };

  // Initial load and reload when reloadKey changes
  useEffect(() => {
    fetchRandomGirl();
  }, [reloadKey]);

  const handleReload = () => {
    setReloadKey(prev => prev + 1); // Trigger section-specific reload
  };

  return (
    <div className="md:ml-16 ml-0 bg-white mx-4 mt-5 rounded-2xl shadow-sm border border-gray-200 p-5 text-center">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-lg text-gray-800">🎯 Random Girl Finder</h2>
        <button 
          onClick={handleReload}
          disabled={loading}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-pink-500 transition-colors disabled:opacity-50"
          aria-label="Reload"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      
      <p className="text-gray-500 text-sm mb-4">
        Discover someone new instantly 💖
      </p>

      {showSkeleton ? (
        <div className="py-6">
          <SkeletonCard />
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="animate-spin text-pink-600" size={28} />
          <p className="mt-2 text-gray-500 text-sm">Finding your match...</p>
        </div>
      ) : girl ? (
        <div className="flex flex-col items-center">
          <img
            src={getOptimizedProfileImage(girl)}
            alt={girl.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-pink-400"
            onError={(e) => handleImageError(e, girl.gender)}
            loading="lazy"
          />
          <h3 className="mt-3 text-lg font-semibold text-gray-800">{girl.name}</h3>
          <p className="text-sm text-gray-500">
            {girl.age} · {girl.location}
          </p>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => navigate(`/messages/${girl._id}`)}
              className="flex items-center gap-2 border border-pink-500 text-pink-600 py-2 px-4 rounded-lg font-medium hover:bg-pink-50 active:scale-95 transition-all"
            >
              <MessageSquare size={18} /> Message
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={fetchRandomGirl}
          className="bg-gradient-to-r from-pink-600 to-red-500 text-white py-3 px-8 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all"
        >
          Get Random Girl 💃
        </button>
      )}
    </div>
  );
}

export default RandomGirl;