import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DefaultAvatar from "../assets/user-dp.png";

function Matches() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("⚠️ Please log in to view profiles.");
        setLoading(false);
        navigate("/login");
        return;
      }

      const response = await fetch("https://backend-vauju-1.onrender.com/api/matches", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": token,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          toast.error("🚨 Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        throw new Error(`Failed to fetch profiles: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const visibleProfiles = Array.isArray(data)
        ? data.filter((item) => item && item._id && item.name)
        : [];

      setProfiles(visibleProfiles);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "🚨 Server error! Try again later.");
      toast.error(err.message || "🚨 Server error! Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="text-center italic mt-10" aria-live="polite">
        <Toaster position="top-center" reverseOrder={false} />
        <svg
          className="animate-spin h-6 w-6 mx-auto text-pink-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        <span>Gathering curated profiles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10" aria-live="assertive">
        <Toaster position="top-center" reverseOrder={false} />
        <p>{error}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchMatches();
            }}
            className="px-5 py-2 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition"
            disabled={loading}
            aria-label="Retry fetching profiles"
          >
            {loading ? "Retrying..." : "Retry"}
          </button>
          {error.includes("log in") && (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 transition"
              aria-label="Log in"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Aura Profiles</h1>
        <p className="text-gray-600 mt-2">
          Handpicked members who are visibility-approved and ready to connect.
        </p>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-3xl">
          <p className="text-gray-500">
            Fresh profiles will appear here as soon as members are approved.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => {
            const avatar = profile.profileImage || DefaultAvatar;
            const primaryTagline = profile.bio || "Aura member";
            const interests = Array.isArray(profile.interests)
              ? profile.interests.filter(Boolean)
              : [];
            return (
              <article
                key={profile._id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all border border-pink-50 relative"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <img
                    src={avatar}
                    alt={profile.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-pink-100"
                  />
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    {profile.name}
                  </h2>
                  {profile.username && (
                    <p className="text-sm text-pink-500 font-medium">@{profile.username}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {primaryTagline}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {profile.age && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-pink-600 bg-pink-100">
                        {profile.age} yrs
                      </span>
                    )}
                    {profile.gender && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-purple-600 bg-purple-100 capitalize">
                        {profile.gender}
                      </span>
                    )}
                  </div>
                  {interests.length > 0 && (
                    <div className="mt-5 w-full">
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                        Interests
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {interests.slice(0, 6).map((interest, index) => (
                          <span
                            key={`${profile._id}-interest-${index}`}
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Messages Icon */}
                <button
                  onClick={() => navigate(`/messages/${profile._id}`)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 transition"
                  aria-label={`Message ${profile.name}`}
                  title={`Message ${profile.name}`}
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Matches;