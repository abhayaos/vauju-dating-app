import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import DefaultAvatar from '../assets/dp.png';
import { getProfileImage, handleImageError } from '../utils/imageUtils';

const SwipeCard = ({ profile, onSwipeLeft, onSwipeRight }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [100, 300], [0, 1]);
  const nopeOpacity = useTransform(x, [-300, -100], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 150) {
      onSwipeRight(profile._id);
    } else if (info.offset.x < -150) {
      onSwipeLeft(profile._id);
    }
  };

  const tagline = profile.bio || "Aura member";
  const interests = Array.isArray(profile.interests)
    ? profile.interests.filter(Boolean).slice(0, 5)
    : [];

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing"
    >
      {/* Like/Nope indicators */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-8 z-10 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg"
      >
        <div className="flex items-center gap-1">
          <Heart size={16} />
          <span>LIKE</span>
        </div>
      </motion.div>
      
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 right-8 z-10 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg"
      >
        <div className="flex items-center gap-1">
          <X size={16} />
          <span>NOPE</span>
        </div>
      </motion.div>

      {/* Card content */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="relative h-80 bg-gradient-to-br from-pink-50 to-purple-50 overflow-hidden">
          <img
            src={getProfileImage(profile)}
            alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => handleImageError(e, profile.gender)}
          />
          
          {profile.isVerified && (
            <div className="absolute top-3 right-3 bg-blue-100 rounded-full p-1.5 shadow-md">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900">
              {profile.name}
              {profile.age && `, ${profile.age}`}
            </h2>
            {profile.isVerified && (
              <div className="bg-blue-50 rounded-full p-1 flex items-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {profile.username && (
            <p className="text-sm text-pink-600 font-medium">
              @{profile.username}
            </p>
          )}

          <p className="text-sm text-gray-600 line-clamp-2">
            {tagline}
          </p>

          <div className="flex flex-wrap gap-2">
            {profile.gender && (
              <span className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full capitalize">
                {profile.gender}
              </span>
            )}
          </div>

          {interests.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Interests
              </p>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((interest, idx) => (
                  <span
                    key={`${profile._id}-int-${idx}`}
                    className="px-2.5 py-1 bg-gray-50 text-gray-700 text-xs rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;