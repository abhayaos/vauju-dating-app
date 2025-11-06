import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  ShoppingBag,
  Home,
  Users,
  Video,
  Bookmark,
  Calendar,
  MapPin,
  Music,
  Camera,
  Gamepad2,
  ShoppingBasket,
  Trophy,
  Gift,
  Wallet,
} from "lucide-react";

function HamNav() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  // Fake loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Main menu items (Facebook-like)
  const mainMenuItems = [
    { icon: <User size={24} />, label: "Profile", path: "/profile" },
    { icon: <Users size={24} />, label: "Friends", path: "/matches" },
    { icon: <MessageSquare size={24} />, label: "Messages", path: "/messages" },
    { icon: <Bell size={24} />, label: "Notifications", path: "/notifications" },
    { icon: <Bookmark size={24} />, label: "Saved", path: "/saved" },
    { icon: <Calendar size={24} />, label: "Events", path: "/events" },
    { icon: <MapPin size={24} />, label: "Nearby", path: "/explore" },
    { icon: <Briefcase size={24} />, label: "Jobs", path: "/jobs" },
  ];

  // Media menu items
  const mediaMenuItems = [
    { icon: <Video size={24} />, label: "Videos", path: "/videos" },
    { icon: <Music size={24} />, label: "Music", path: "/music" },
    { icon: <Camera size={24} />, label: "Photos", path: "/photos" },
    { icon: <Gamepad2 size={24} />, label: "Games", path: "/games" },
  ];

  // Shopping menu items
  const shoppingMenuItems = [
    { icon: <ShoppingBasket size={24} />, label: "Marketplace", path: "/marketplace" },
    { icon: <Coins size={24} />, label: "Buy Coins", path: "/buy-coins" },
    { icon: <Wallet size={24} />, label: "Orders", path: "/orders" },
  ];

  // Support menu items
  const supportMenuItems = [
    { icon: <HelpCircle size={24} />, label: "Support", path: "/support" },
    { icon: <ScrollText size={24} />, label: "Terms", path: "/term-and-conditions" },
    { icon: <Star size={24} />, label: "Hall of Fame", path: "/hall-of-fame" },
    { icon: <BookOpen size={24} />, label: "Blogs", path: "/blogs" },
  ];

  const handleAuthClick = () => {
    if (isLoggedIn) {
      console.log("HamNav: Logout initiated");
      logout();
      setTimeout(() => {
        console.log("HamNav: Navigating to /register");
        navigate("/register", { replace: true });
      }, 100);
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header with user info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {isLoggedIn ? user?.name || "User" : "Guest"}
              </h2>
              <p className="text-xs text-gray-500">
                {isLoggedIn ? "Online" : "Not logged in"}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Shortcuts section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Shortcuts</h3>
        <div className="grid grid-cols-4 gap-3">
          <div 
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="bg-gray-100 p-3 rounded-lg mb-1">
              <User size={20} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-700">Profile</span>
          </div>
          <div 
            onClick={() => navigate("/matches")}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="bg-gray-100 p-3 rounded-lg mb-1">
              <Heart size={20} className="text-red-500" />
            </div>
            <span className="text-xs text-gray-700">Matches</span>
          </div>
          <div 
            onClick={() => navigate("/messages")}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="bg-gray-100 p-3 rounded-lg mb-1">
              <MessageSquare size={20} className="text-green-500" />
            </div>
            <span className="text-xs text-gray-700">Messages</span>
          </div>
          <div 
            onClick={() => navigate("/notifications")}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="bg-gray-100 p-3 rounded-lg mb-1">
              <Bell size={20} className="text-yellow-500" />
            </div>
            <span className="text-xs text-gray-700">Alerts</span>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Menu</h3>
        <div className="space-y-1">
          {mainMenuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div className="text-blue-600">{item.icon}</div>
              <span className="text-gray-800">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Media Section */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Media</h3>
        <div className="space-y-1">
          {mediaMenuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div className="text-purple-600">{item.icon}</div>
              <span className="text-gray-800">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Section */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Shopping</h3>
        <div className="space-y-1">
          {shoppingMenuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div className="text-green-600">{item.icon}</div>
              <span className="text-gray-800">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Support</h3>
        <div className="space-y-1">
          {supportMenuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div className="text-gray-600">{item.icon}</div>
              <span className="text-gray-800">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout/Login Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleAuthClick}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium ${
            isLoggedIn
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          {isLoggedIn ? (
            <>
              <LogOut size={20} />
              <span>Logout</span>
            </>
          ) : (
            <>
              <LogIn size={20} />
              <span>Login</span>
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} AuraMeet. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default HamNav;