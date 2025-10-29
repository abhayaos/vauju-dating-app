// src/components/HamNav.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Briefcase,
  Globe,
  HelpCircle,
  LogOut,
  Bell,
  Heart,
  MessageSquare,
  LogIn,
  ScrollText,
  Star,
  BookOpen,
  Coins,
  Plus,
} from "lucide-react";

function HamNav() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const isLoggedIn = !!localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState(".");
  const [yugalCurrency, setYugalCurrency] = useState(250); // mock balance

  // Fake loading animation
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "." : prev + "."));
    }, 500);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, []);

  const menuItems = [
    { icon: <User size={22} />, label: "Profile", path: "/profile" },
    { icon: <Briefcase size={22} />, label: "Dashboard", path: "/dashboard" },
    { icon: <Bell size={22} />, label: "Notifications", path: "/notifications" },
    { icon: <MessageSquare size={22} />, label: "Messages", path: "/messages" },
    { icon: <ScrollText size={22} />, label: "Terms", path: "/term-and-conditions" },
    { icon: <Globe size={22} />, label: "Community", path: "/community" },
    { icon: <Star size={22} />, label: "Hall of Fame", path: "/hall-of-fame" },
    { icon: <BookOpen size={22} />, label: "Blogs", path: "/blogs" },
    { icon: <HelpCircle size={22} />, label: "Support", path: "/support" },
  ];

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-blue-600 text-2xl font-semibold">
        Loading{dots}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      {/* User Info */}
      {isLoggedIn && user && (
        <div className="bg-white p-4 mt-4 mx-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
            <p className="text-gray-500 text-xs">{user.email}</p>
          </div>
        </div>
      )}

      {/* Yugal Currency Card */}
      {isLoggedIn && (
        <div className="bg-white mx-4 mt-3 rounded-xl shadow-sm border border-gray-200 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
              <Coins size={20} />
            </div>
            <div>
              <p className="text-gray-800 text-sm font-semibold">Yugal Currency</p>
              <p className="text-gray-500 text-xs">{yugalCurrency.toLocaleString()} YC</p>
            </div>
          </div>
          <button
            onClick={() => alert("Top Up feature coming soon 🔥")}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold active:scale-95 transition-all"
          >
            <Plus size={14} /> Top Up
          </button>
        </div>
      )}

      {!isLoggedIn && (
        <div className="bg-white p-4 mt-4 mx-4 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-gray-600 text-sm mb-3">You’re not logged in</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white w-full py-2 rounded-lg font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
          >
            Login to Continue
          </button>
        </div>
      )}

      {/* Facebook Lite Style Menu */}
      <div className="bg-white mx-4 mt-5 rounded-xl shadow-sm border border-gray-200 p-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            >
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-medium text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Auth Button */}
      <div className="mt-5 mx-4">
        <button
          onClick={handleAuthClick}
          className={`w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl shadow-md transition-all active:scale-95 ${
            isLoggedIn
              ? "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:opacity-90"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
          }`}
        >
          {isLoggedIn ? (
            <>
              <LogOut size={18} /> Logout
            </>
          ) : (
            <>
              <LogIn size={18} /> Login
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 mb-5 text-center text-[11px] text-gray-500">
        AuraMeet © {new Date().getFullYear()} <br /> Made with ❤️ in Nepal 🇳🇵
      </div>
    </div>
  );
}

export default HamNav;
