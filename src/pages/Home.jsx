import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col justify-start items-center text-center px-4 pt-16 sm:pt-24">
      {/* Hero Section */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to <span className="text-pink-500">AuraMeet</span> Dating App
      </h1>
      <p className="text-gray-700 text-lg sm:text-xl mb-6 max-w-md">
        Connect with amazing people around the world. Find love, friends, or just new conversations.
      </p>

      {/* Explore Button */}
      <button
        onClick={() => navigate('/explore')}
        className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-pink-600 transition transform hover:-translate-y-1 mb-12 sm:mb-16"
      >
        Explore Now
      </button>

      {/* Optional Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Meet New People</h3>
          <p className="text-gray-600 text-sm">
            Browse profiles and chat with people who share your interests.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
          <p className="text-gray-600 text-sm">
            Your privacy is our top priority. Chat safely and securely.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Fun & Interactive</h3>
          <p className="text-gray-600 text-sm">
            Play icebreakers, send gifts, and make dating more fun.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
