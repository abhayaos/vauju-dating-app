import React, { useEffect, useState } from "react";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    try {
      const response = await fetch(
        "https://backend-vauju-1.onrender.com/api/matches",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.statusText}`);
      }

      const data = await response.json();
      setMatches(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
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
        <p className="text-center text-gray-500">No matches found</p>
      ) : (
        <ul className="space-y-4">
          {matches.map((match) => (
            <li
              key={match._id}
              className="p-4 border border-gray-200 rounded shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg">{match.name}</span>
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
