import React, { useEffect, useState } from "react";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        "https://backend-vauju-1.onrender.com/api/matches",
        { method: "GET", headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Matches API Response:", data); // Debug: Check this in console
      const fetchedMatches = Array.isArray(data) ? data : Array.isArray(data.matches) ? data.matches : [];
      setMatches(fetchedMatches);
      setLoading(false);

      // No error for empty array—handle in UI
      if (fetchedMatches.length === 0) {
        console.log("Empty matches—database may need seeding.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return <div className="text-center italic mt-10">Loading matches...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Error: {error}
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchMatches();
          }}
          className="ml-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Matches</h1>

      {matches.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No matches yet.</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create Your First Match
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {matches.map((match) => (
            <li
              key={match._id}
              className="p-4 border border-gray-200 rounded shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg">{match.name || "Unnamed Match"}</span>
                {match.date && (
                  <span className="text-gray-500 text-sm">
                    {new Date(match.date).toLocaleDateString()}
                  </span>
                )}
              </div>
              {match.description && (
                <p className="text-gray-600 mt-2">{match.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Matches;