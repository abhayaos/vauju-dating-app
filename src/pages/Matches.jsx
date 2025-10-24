// src/Matches.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("⚠️ Please log in to view matches.");
        setLoading(false);
        navigate("/login");
        return;
      }

      const headers = { 
        "Content-Type": "application/json",
        "x-user-id": token 
      };

      const response = await fetch("https://backend-vauju-1.onrender.com/api/matches", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          toast.error("🚨 Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        throw new Error(`Failed to fetch matches: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Matches API Response:", data);

      let fetchedMatches = [];
      if (Array.isArray(data)) {
        fetchedMatches = data;
      } else if (data && Array.isArray(data.matches)) {
        fetchedMatches = data.matches;
      } else if (data && Array.isArray(data.data)) {
        fetchedMatches = data.data;
      } else {
        console.warn("Unexpected API response structure:", data);
        setError("Invalid response from server. Please try again later.");
        setLoading(false);
        return;
      }

      fetchedMatches = fetchedMatches.filter(
        (match) => match && match._id && typeof match._id === "string" && match.name
      );

      setMatches(fetchedMatches);
      setLoading(false);

      if (fetchedMatches.length === 0) {
        console.log("No matches found. Database may be empty or user lacks visibility.");
      }
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
          className="animate-spin h-5 w-5 mx-auto text-indigo-600"
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
        <span>Loading matches...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10" aria-live="assertive">
        <Toaster position="top-center" reverseOrder={false} />
        <p>{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchMatches();
          }}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition"
          disabled={loading}
          aria-label="Retry fetching matches"
        >
          {loading ? "Retrying..." : "Retry"}
        </button>
        {error.includes("log in") && (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 ml-3 px-4 py-2 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600 transition"
            aria-label="Log in"
          >
            Log In
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-3xl font-bold mb-6 text-center">Matches</h1>
      {matches.length === 0 ? (
        <div className="text-center py-8" aria-live="polite">
          <p className="text-gray-500 mb-4">
            {localStorage.getItem("token")
              ? "No matches available. Create one to get started."
              : "Please log in to view matches."}
          </p>
         
        </div>
      ) : (
        <ul className="space-y-4" aria-label="List of matches">
          {matches.map((match) => (
            <li
              key={match._id}
              className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg">{match.name}</span>
                {match.createdAt && (
                  <span className="text-gray-500 text-sm">
                    {isValidDate(match.createdAt)
                      ? new Date(match.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Date not available"}
                  </span>
                )}
              </div>
              {match.age && <p className="text-gray-600 mt-2">Age: {match.age}</p>}
              {match.gender && <p className="text-gray-600 mt-1">Gender: {match.gender}</p>}
              {match.interests && match.interests.length > 0 && (
                <p className="text-gray-600 mt-1">Interests: {match.interests.join(", ")}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Matches;