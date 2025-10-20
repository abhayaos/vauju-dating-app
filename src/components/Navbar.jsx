import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Assets
import SupportIcon from "../assets/support.png";
import Logo from "../assets/logo.png";

// Icons
import {
  Home,
  MessageSquare,
  MessageCircle,
  Users,
  User,
  LogOut,
  LogIn,
  UserPlus,
  PlayCircle,
} from "lucide-react";

function XSidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Auth check
  useEffect(() => {
    const checkAuth = () => {
      const token = JSON.parse(localStorage.getItem("token") || "null");
      setIsLoggedIn(!!token);
    };
    checkAuth();

    const onStorage = (e) => {
      if (!e || e.key === "token") checkAuth();
    };
    const onAuthChange = () => checkAuth();

    window.addEventListener("storage", onStorage);
    window.addEventListener("authChange", onAuthChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChange", onAuthChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    try {
      window.dispatchEvent(new Event("authChange"));
      localStorage.setItem("__auth_change_ts", Date.now());
    } catch {}
    setIsLoggedIn(false);
    navigate("/login");
    setShowDropdown(false);
  };

  const navItems = [
    { path: "/", icon: <Home size={22} />, label: "Home" },
    { path: "/reels", icon: <PlayCircle size={22} />, label: "Reels" },
    { path: "/matches", icon: <Users size={22} />, label: "Matches" },
    { path: "/messages", icon: <MessageSquare size={22} />, label: "Messages" },
    { path: "/private", icon: <MessageCircle size={22} />, label: "Private Chat" },
    {
      path: "/support",
      icon: (
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <img src={SupportIcon} alt="Support" className="w-4 h-4" />
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
    <aside className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 shadow-lg flex flex-col justify-between z-50">
      {/* Top Nav */}
      <div className="flex flex-col items-center mt-6 space-y-2">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center justify-center py-6 border-b border-gray-100 w-full hover:bg-gray-50 transition"
        >
          <img src={Logo} alt="Logo" className="w-10 h-10" />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col mt-6 space-y-3">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200
                ${
                  isActive(item.path)
                    ? "bg-black text-white shadow-md scale-110"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              title={item.label}
            >
              {item.icon}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Auth Buttons */}
      <div className="flex flex-col items-center mb-6 px-1 border-t border-gray-100 pt-4 relative">
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition duration-200 text-gray-700"
              title="Account"
            >
              <User size={22} />
            </button>

            {showDropdown && (
              <div className="absolute ml-5 bottom-14 left-1/2 transform -translate-x-1/2 flex flex-col w-32 bg-white border border-gray-200 shadow-md rounded-md overflow-hidden z-50">
                <Link
                  to="/profile"
                  className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-red-50 hover:text-red-500 flex items-center space-x-2 w-full text-left"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white hover:bg-gray-900 transition duration-200"
              title="Login"
            >
              <LogIn size={18} />
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center w-12 h-12 rounded-full border border-black text-black hover:bg-gray-50 transition duration-200"
              title="Register"
            >
              <UserPlus size={18} />
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}

export default XSidebar;
