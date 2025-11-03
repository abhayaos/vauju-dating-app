// src/components/MobileNavbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, MessageCircle, FileImage ,Video , Smile , Bell, UserCheck } from "lucide-react";


function MobileNavbar() {
  const location = useLocation();

   const handleAlert = () => {
    alert("This feature is coming soon!");
  }

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/friends", icon: UserCheck, label: "Friends" },
    { path: "/matches", icon: Users, label: "Matches" },
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
        
    </nav>
  );
}

export default MobileNavbar;
