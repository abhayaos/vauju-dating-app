import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Assets
import SupportIcon from "../assets/support.png";
import Logo from "../assets/logo.png";

// Icons
import { Home, MessageSquare, Users, User, LogOut, LogIn, UserPlus, Compass, Heart, Podcast, UserCheck, Shield } from "lucide-react";

function XSidebar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const { isLoggedIn, logout, token } = useAuth();
  
  const API_BASE = import.meta.env.VITE_API_URL || 'https://api.vauju.com';

  // Fetch notification count with error handling
  const fetchNotificationCount = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const unread = data.filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching notification count:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Update notification count on mount and when token changes
  useEffect(() => {
    fetchNotificationCount();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 30000);
    
    // Listen for notification updates
    const handleNotificationUpdate = () => {
      fetchNotificationCount();
    };
    
    // Listen for real-time notifications
    const handleRealTimeNotification = () => {
      fetchNotificationCount();
    };
    
    window.addEventListener('notificationUpdate', handleNotificationUpdate);
    window.addEventListener('notification', handleRealTimeNotification);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationUpdate', handleNotificationUpdate);
      window.removeEventListener('notification', handleRealTimeNotification);
    };
  }, [fetchNotificationCount]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Use AuthContext logout
    logout();
    
    // Clear dropdown and redirect
    setShowDropdown(false);
    
    // Give listeners time to cleanup (e.g., disconnect Socket.IO)
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100);
  };

  const navItems = [
    { path: "/", icon: <Home size={20} />, label: "Home" },
    { path: "/explore", icon: <Compass size={20} />, label: "Explore" },
    { path: "/friends", icon: <UserCheck size={20} />, label: "Friends" },
    { path: "/matches", icon: <Users size={20} />, label: "Matches" },
    { path: "/messages", icon: <MessageSquare size={20} />, label: "Messages" },
    { 
      path: "/notifications", 
      icon: (
        <div className="relative">
          <Heart size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      ), 
      label: "Notifications" 
    },
    { path: "/blocked", icon: <Shield size={20} />, label: "Blocked" },
    { path: "/private-space", icon: <Podcast size={20} />, label: "Private Space" },
    {
      path: "/support",
      icon: (
        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <img src={SupportIcon} alt="Support" className="w-3.5 h-3.5" />
        </div>
      ),
      label: "Support",
    },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[70px] bg-white border-r border-gray-200 flex flex-col justify-between z-50">
      {/* Top Section */}
      <div className="flex flex-col items-center mt-4 space-y-1">
        <Link to="/" className="flex items-center justify-center py-4 border-b border-gray-100 w-full hover:bg-gray-50 transition">
          <img src={Logo} alt="Logo" className="w-8 h-8" />
        </Link>

        <nav className="flex flex-col mt-4 space-y-2">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-black text-white shadow-md scale-105"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
              title={item.label}
            >
              {item.icon}
            </Link>
          ))}
        </nav>
      </div>

      {/* Auth Section */}
      <div className="flex flex-col items-center mb-4 px-1 border-t border-gray-100 pt-3 relative">
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition duration-200 text-gray-700"
              title="Account"
            >
              <User size={20} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Link
              to="/login"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition duration-200 text-gray-700"
              title="Login"
            >
              <LogIn size={20} />
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition duration-200 text-gray-700"
              title="Register"
            >
              <UserPlus size={20} />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

export default XSidebar;