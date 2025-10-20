// src/pages/Explore.jsx
import React from 'react'
import Baddie from '../explore-imgs/baddie.png'
import Ghosts from '../explore-imgs/ghosts.png'
import PP from '../explore-imgs/pp.png'
import Readers from '../explore-imgs/readers.png'
import Sigma from '../explore-imgs/sigma.png'

function Explore() {
  const images = [Baddie, Ghosts, PP, Readers, Sigma]

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex flex-col items-center">
      
      {/* Flex + Grid layout */}
      <div className="flex flex-wrap justify-center gap-4 w-full">
        {images.map((src, index) => (
          <div
            key={index}
            className={`overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 transform hover:scale-105 ${
              index % 3 === 0 ? 'w-full sm:w-1/2 md:w-1/3' : 'w-1/2 sm:w-1/3 md:w-1/4'
            }`}
          >
            <img
              src={src}
              alt={`Explore ${index}`}
              className="w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>
      
    </div>
  )
}

export default Explore
