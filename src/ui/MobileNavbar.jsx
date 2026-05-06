import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Newspaper, Heart, MessageCircle, User } from "lucide-react";

const tabs = [
  { path: "/", icon: <Home size={22} />, label: "Discover" },
  { path: "/feed", icon: <Newspaper size={22} />, label: "Feed" },
  { path: "/matches", icon: <Heart size={22} />, label: "Matches" },
  { path: "/chats", icon: <MessageCircle size={22} />, label: "Chats" },
  { path: "/profile", icon: <User size={22} />, label: "Profile" },
];

function MobileNavbar() {
  const location = useLocation();

  return (
    <nav className="flex justify-around items-center py-2 px-1">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${
              isActive ? "text-pink-500" : "text-gray-400"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileNavbar;
