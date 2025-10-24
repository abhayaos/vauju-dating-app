import React, { useState } from "react";
import ProfileImage from "../assets/dp.png";
import { FileImage, Video, Smile } from "lucide-react";

function PostModel() {
  const [showAlert, setShowAlert] = useState(false);

  const handleAlert = () => {
    setShowAlert(true);
    // auto hide after 2.5 seconds
    setTimeout(() => setShowAlert(false), 2500);
  };

  return (
    <>
  <main className="md:hidden block">

        {/* Custom Alert */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          Only limited users can create posts.🥀
        </div>
      )}

      {/* Post Input Section */}
      <div
        className="profile-img-sec flex items-center px-4 py-3 border-t border-b border-gray-200"
        role="region"
        aria-label="Create a post"
      >
        <img
          src={ProfileImage}
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
          alt="Profile"
        />

        <div className="flex-1 mx-3">
          <input
            onClick={handleAlert}
            type="text"
            placeholder="What's on your mind?"
            className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            aria-label="What's on your mind?"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-200 transition duration-200" title="Add Photo" aria-label="Add Photo">
            <FileImage size={20} className="text-gray-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 transition duration-200 hidden sm:block" title="Add Video" aria-label="Add Video">
            <Video size={20} className="text-gray-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 transition duration-200 hidden sm:block" title="Add Feeling/Activity" aria-label="Add Feeling or Activity">
            <Smile size={20} className="text-gray-500" />
          </button>
        </div>
      </div>
  </main>

      
    </>
  );
}

export default PostModel;
