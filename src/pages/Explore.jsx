// src/pages/Explore.jsx
import React from "react";

function Explore() {
  // Sample images (random placeholder)
  const images = Array.from({ length: 30 }, (_, i) => `https://picsum.photos/300/300?random=${i}`);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-2 sm:px-4">
      {/* Hero / Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Explore 🔍</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Discover photos and connect with amazing people.
        </p>
      </div>

      {/* Grid of images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative w-full pb-full overflow-hidden rounded-lg group cursor-pointer"
          >
            <img
              src={src}
              alt={`Explore ${index}`}
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
