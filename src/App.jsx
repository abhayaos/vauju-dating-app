import React from "react";
import { FaStar, FaFacebook, FaTiktok, FaInstagram } from "react-icons/fa";
import "./App.css";

// Generate random stars for the background
const generateStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    animationDelay: `${Math.random() * 3}s`,
    animationType: Math.random() > 0.5 ? "twinkle" : "float",
  }));
};

// Generate shooting stars
const generateShootingStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: `${Math.random() * 10}s`,
  }));
};

const stars = generateStars(100);
const shootingStars = generateShootingStars(3);

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-center p-6 overflow-hidden relative">
      {/* Moving stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <FaStar
            key={star.id}
            className={`absolute text-white ${star.animationType === "twinkle" ? "animate-twinkle" : "animate-float"}`}
            style={{
              top: star.top,
              left: star.left,
              fontSize: star.size,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
        
        {/* Shooting stars */}
        {shootingStars.map((shootingStar) => (
          <div
            key={`shooting-${shootingStar.id}`}
            className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full animate-shoot"
            style={{
              animationDelay: shootingStar.delay,
            }}
          >
            <div className="absolute top-0 left-0 w-4 h-1 bg-gradient-to-r from-white to-transparent opacity-50 transform -rotate-45 -translate-y-1"></div>
          </div>
        ))}
      </div>
      
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-3 text-white cosmic-heading">
          YugalMeet
        </h1>
        <p className="text-gray-300 text-lg mb-6">
          Our site is getting a little upgrade. Hang tight!
        </p>
        
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mt-8">
          <a href="https://facebook.com/theabhayabikramshahi" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">
            <FaFacebook size={32} />
          </a>
          <a href="https://tiktok.com/@aurameetofficial" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-300 transition-colors">
            <FaTiktok size={32} />
          </a>
          <a href="https://instagram.com/yugal_meet" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-400 transition-colors">
            <FaInstagram size={32} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;