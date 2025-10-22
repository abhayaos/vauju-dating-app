import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-start items-center text-center px-4 pt-16 sm:pt-24">
      
      {/* Hero Section */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to <span className="text-pink-500">AuraMeet</span> Dating App
      </h1>
      <p className="text-gray-700 text-lg sm:text-xl mb-6 max-w-md">
        Connect with amazing people around the world. Find love, friends, or just new conversations.
      </p>
      <button
        onClick={() => navigate('/explore')}
        className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-pink-600 transition transform hover:-translate-y-1 mb-12 sm:mb-16"
      >
        Explore Now
      </button>

      {/* Optional Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full mb-16">
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

      {/* Testimonials Section */}
      <div className="bg-pink-50 py-12 w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm mb-4">
              "AuraMeet helped me find someone special! The app is super easy to use."
            </p>
            <p className="font-semibold text-gray-900">— Sarah K.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm mb-4">
              "I love the privacy features. I feel safe chatting and meeting new people."
            </p>
            <p className="font-semibold text-gray-900">— Mike L.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm mb-4">
              "The icebreakers are so much fun! Dating doesn’t feel awkward anymore."
            </p>
            <p className="font-semibold text-gray-900">— Anika P.</p>
          </div>
        </div>
      </div>

      {/* Newsletter / Call to Action */}
      <div className="py-12 w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-6">Get the latest features and updates from AuraMeet directly to your inbox.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 flex-1"
          />
          <button className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition">
            Subscribe
          </button>
        </div>
      </div>


    </div>
  );
}

export default Home;
