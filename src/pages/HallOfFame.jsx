import React from "react";
import { Link } from "react-router-dom";


function HallOfFame() {
  const bugBounters = [
    {
      name: "Lil Mafia",
      contributions: 20,
      profileLink: "/working",
      blogLink: "/hall-of-fame/bounty/user/mandip",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6 flex flex-col items-center">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-2 tracking-wider">
          HALL OF FAME 🏆
        </h1>
        <p className="text-lg text-gray-300 uppercase tracking-widest">
          AuraMeet – Vauju Khoj Abhiyan
        </p>
      </header>

      {/* Bug Bounter Card */}
      <div className="grid grid-cols-1 gap-8 w-full max-w-2xl">
        {bugBounters.map((bounter, index) => (
          <div
            key={index}
            className="bg-gray-900 border-2 border-green-500 rounded-xl p-6 shadow-lg hover:shadow-green-400 transition-all flex flex-col items-center text-center"
          >
            {/* Retro avatar circle */}
            <div className="w-24 h-24 rounded-full bg-green-700 flex items-center justify-center mb-4 text-3xl font-bold">
              {bounter.name[0]}
            </div>
            <h2 className="text-3xl font-bold text-green-400 mb-2">
              {bounter.name}
            </h2>
            <p className="text-gray-300 mb-4">
              Contributions:{" "}
              <span className="font-semibold text-white">
                {bounter.contributions}
              </span>
            </p>
            <div className="flex gap-4">
              <a
                href={bounter.profileLink}
                className="px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-600 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Profile
              </a>
              <a
                href={bounter.blogLink}
                className="px-4 py-2 bg-purple-500 text-black font-bold rounded hover:bg-purple-600 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Blog
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Go Home Button */}
      <div className="mt-12">
        <Link
          to="/"
          className="px-6 py-3 bg-white text-black font-bold rounded shadow-lg hover:shadow-green-500 transition text-lg tracking-wide"
        >
          ← GO HOME
        </Link>
      </div>
    </div>
  );
}

export default HallOfFame;
