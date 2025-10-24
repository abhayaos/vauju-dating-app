// src/components/MobileNavbar.jsx
import React from "react";
import { Link, useLocation, } from "react-router-dom";
import { Home, Users, MessageCircle, FileImage ,Video , Smile , Bell } from "lucide-react";
import ProfileImage from "../assets/dp.png";

function MobileNavbar() {
  const location = useLocation();

   const handleAlert = () => {
    alert("This feature is coming soon!");
  }

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/matches", icon: Users, label: "Friends" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
  ];

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex justify-between items-center px-4 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center relative group transition"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                  isActive ? "bg-blue-50 shadow-sm scale-105 text-blue-600" : "text-gray-500 hover:text-blue-500"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
              </div>

              {/* Active indicator */}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-blue-600 rounded-full shadow-sm"></span>
              )}
            </Link>
          );
        })}
      
      </div>
         <div
      className="profile-img-sec flex items-center px-4 py-3  border-t border-b border-gray-200"
      role="region"
      aria-label="Create a post"
    >
      {/* Profile Image */}
      <img
        src={ProfileImage}
        className="w-10 h-10 rounded-full object-cover border border-gray-300"
        alt="Profile"
      />

      {/* Text Input */}
      <div className="flex-1 mx-3">
        <input
          onClick={handleAlert}
          type="text"
          placeholder="What's on your mind?"
          className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          aria-label="What's on your mind?"
        />
      </div>

      {/* Action Icons */}
      <div className="flex items-center space-x-2">
        <button
          className="p-2 rounded-full hover:bg-gray-200 transition duration-200"
          title="Add Photo"
          aria-label="Add Photo"
        >
          <FileImage size={20} className="text-gray-500" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-200 transition duration-200 hidden sm:block"
          title="Add Video"
          aria-label="Add Video"
        >
          <Video size={20} className="text-gray-500" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-200 transition duration-200 hidden sm:block"
          title="Add Feeling/Activity"
          aria-label="Add Feeling or Activity"
        >
          <Smile size={20} className="text-gray-500" />
        </button>
      </div>
    </div>
    </nav>
  );
}

export default MobileNavbar;
