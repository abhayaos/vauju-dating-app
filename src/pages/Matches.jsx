import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { MessageCircle, MapPin, Zap } from "lucide-react";
import DefaultAvatar from "../assets/dp.png";
import { getProfileImage, handleImageError } from "../utils/imageUtils";
import { useAuth } from "../context/AuthContext";

// Base URL for API calls
const BASE_URL = "https://backend-vauju-1.onrender.com/api";

/* -------------------------------------------------
   Skeleton Loading Component
   ------------------------------------------------- */
const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
  >
    {/* Image skeleton */}
    <div className="relative h-56 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" />

    {/* Body skeleton */}
    <div className="p-5 space-y-3">
      {/* Name skeleton */}
      <div className="h-6 bg-gray-200 rounded-lg w-3/4 animate-pulse" />

      {/* Username skeleton */}
      <div className="h-4 bg-gray-100 rounded-lg w-1/3 animate-pulse" />

      {/* Bio skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-gray-100 rounded-lg w-5/6 animate-pulse" />
      </div>

      {/* Tags skeleton */}
      <div className="flex gap-2 pt-2">
        <div className="h-6 bg-gray-100 rounded-full w-16 animate-pulse" />
        <div className="h-6 bg-gray-100 rounded-full w-20 animate-pulse" />
      </div>

      {/* Interests skeleton */}
      <div className="pt-2 border-t border-gray-100">
        <div className="h-3 bg-gray-100 rounded w-20 mb-2 animate-pulse" />
        <div className="flex gap-1.5">
          <div className="h-6 bg-gray-50 rounded-full w-12 animate-pulse" />
          <div className="h-6 bg-gray-50 rounded-full w-14 animate-pulse" />
          <div className="h-6 bg-gray-50 rounded-full w-16 animate-pulse" />
        </div>
      </div>
    </div>
  </motion.div>
);

/* -------------------------------------------------
   Blue-Tick SVG – tiny, reusable component
   ------------------------------------------------- */
const BlueTick = () => (
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
);

function Matches() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genderFilter, setGenderFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 6;
  const navigate = useNavigate();
  const { token, loading: authLoading } = useAuth();

  /* ----------------------- FETCH ----------------------- */
  const fetchMatches = async () => {
    try {
      if (!token) {
        // If token is not available and auth is still loading, wait
        if (authLoading) {
          return;
        }
        // Only redirect if auth is done loading and still no token
        setLoading(false);
        navigate("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/matches`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        throw new Error(`Failed to fetch profiles: ${response.status}`);
      }

      const data = await response.json();
      const visibleProfiles = Array.isArray(data)
        ? data.filter((item) => item && item._id && item.name)
        : [];

      setProfiles(visibleProfiles);
      setFilteredProfiles(visibleProfiles);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Server error. Please try again later.");
      toast.error(err.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth context to finish loading before attempting fetch
    if (!authLoading) {
      fetchMatches();
    }
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [authLoading, token]);

  /* ----------------------- FILTER ----------------------- */
  useMemo(() => {
    let filtered = profiles;

    // Gender filter
    if (genderFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.gender?.toLowerCase() === genderFilter
      );
    }

    // Interest search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.interests?.some((i) => i.toLowerCase().includes(query))
      );
    }

    setFilteredProfiles(filtered);
  }, [profiles, genderFilter, searchQuery]);

  // Show loading state only if auth is still loading
  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 md:ml-12">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Meet Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Aura Matches
            </span>
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover handpicked, visibility-approved members ready to connect
            meaningfully.
          </p>
        </div>

        {/* Filters Skeleton */}
        <div className="mb-10 space-y-4">
          <div className="flex justify-center gap-3 flex-wrap">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"
              />
            ))}
          </div>
          <div className="max-w-md mx-auto">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Profiles Grid Skeleton */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <SkeletonCard key={idx} index={idx} />
          ))}
        </div>
      </div>
    );
  }

  // Redirect if not authenticated after auth loading is complete
  if (!token) {
    return (
      <div className="flex md:ml-12 flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="bg-red-50 border border-red-200 rounded-full p-4 mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Authentication Required
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">Please log in to view profiles.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 md:ml-12">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Meet Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Aura Matches
            </span>
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover handpicked, visibility-approved members ready to connect
            meaningfully.
          </p>
        </div>

        {/* Filters Skeleton */}
        <div className="mb-10 space-y-4">
          <div className="flex justify-center gap-3 flex-wrap">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"
              />
            ))}
          </div>
          <div className="max-w-md mx-auto">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Profiles Grid Skeleton */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <SkeletonCard key={idx} index={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex md:ml-12 flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="bg-red-50 border border-red-200 rounded-full p-4 mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchMatches();
            }}
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Retrying..." : "Try Again"}
          </button>
          {error.includes("log in") && (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    );
  }

  // Pagination logic
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 md:ml-12">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Meet Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Aura Matches
          </span>
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Discover handpicked, visibility-approved members ready to connect
          meaningfully.
        </p>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 space-y-4"
      >
        {/* Gender Buttons */}
        <div className="flex justify-center gap-3 flex-wrap">
          {["all", "female", "male"].map((filter) => (
            <button
              key={filter}
              onClick={() => setGenderFilter(filter)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm capitalize transition-all duration-200 ${
                genderFilter === filter
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter === "all" ? "All" : filter}
            </button>
          ))}
        </div>

        {/* Interest Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search interests (e.g., hiking, music)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Empty State */}
      {filteredProfiles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-dashed border-pink-200 rounded-3xl p-16 text-center"
        >
          <div className="bg-white bg-opacity-80 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-sm">
            <svg
              className="w-12 h-12 text-pink-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">No matches found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery || genderFilter !== "all"
              ? "Try adjusting your filters or search for something else."
              : "New profiles are being reviewed. Check back soon!"}
          </p>
        </motion.div>
      ) : (
        <>
          {/* Profiles Grid */}
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {currentProfiles.map((profile) => {
              const tagline = profile.bio || "Aura member";
              const interests = Array.isArray(profile.interests)
                ? profile.interests.filter(Boolean).slice(0, 5)
                : [];

              return (
                <motion.article
                  key={profile._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col"
                  onClick={() => navigate(`/messages/${profile._id}`)}
                >
                  {/* Avatar + optional badge */}
                  <div className="relative h-72 bg-gradient-to-br from-pink-50 to-purple-50 overflow-hidden flex items-center justify-center rounded-3xl">
                    <img
                      src={getProfileImage(profile)}
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-3xl"
                      onError={(e) => handleImageError(e, profile.gender)}
                    />

                    {/* Verified Badge */}
                    {profile.isVerified && (
                      <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-full p-2 shadow-lg flex items-center justify-center z-10">
                        <BlueTick />
                      </div>
                    )}
                    
                    {/* Online Status */}
                    {profile.isOnline && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg z-10 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-white rounded-full"></span> Online
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-6 space-y-3 flex-1 flex flex-col bg-white">
                    {/* Name + age + verified badge */}
                    <div className="flex items-center space-x-2 justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {profile.name}
                          {profile.age && <span className="text-xl text-gray-600 font-normal">, {profile.age}</span>}
                        </h2>
                        {profile.isVerified && (
                          <div className="bg-blue-50 rounded-full p-1 flex-shrink-0 flex items-center">
                            <BlueTick />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Username */}
                    {profile.username && (
                      <p className="text-sm text-pink-600 font-medium truncate">
                        @{profile.username}
                      </p>
                    )}

                    {/* Location */}
                    {profile.location && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {profile.location}
                      </p>
                    )}

                    {/* Bio */}
                    <p className="text-sm text-gray-700 line-clamp-2 flex-grow italic">
                      "{profile.bio || 'Happy to connect!'}"
                    </p>

                    {/* Gender tag */}
                    {profile.gender && (
                      <div className="flex gap-2">
                        <span className="px-3 py-1 text-xs font-bold text-purple-700 bg-purple-100 rounded-full capitalize">
                          {profile.gender === 'male' ? 'Male' : 'Female'}
                        </span>
                      </div>
                    )}

                    {/* Interests */}
                    {interests.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-1 mb-2">
                          <Zap className="w-4 h-4 text-gray-500" />
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Interests</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {interests.slice(0, 4).map((interest, idx) => (
                            <span
                              key={`${profile._id}-int-${idx}`}
                              className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800 text-xs font-semibold rounded-full hover:from-pink-200 hover:to-purple-200 transition"
                            >
                              {interest}
                            </span>
                          ))}
                          {profile.interests?.length > 4 && (
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
                              +{profile.interests.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Chat-now button */}
                    <motion.button
                      onClick={() => navigate(`/messages/${profile._id}`)}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat Now
                    </motion.button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-12 flex justify-center"
            >
              <nav className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-md"
                  }`}
                >
                  Previous
                </button>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <motion.button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-md"
                        }`}
                      >
                        {pageNumber}
                      </motion.button>
                    );
                  } else if (
                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                    (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span key={pageNumber} className="px-2 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-md"
                  }`}
                >
                  Next
                </button>
              </nav>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

export default Matches;
