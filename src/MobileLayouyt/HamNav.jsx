import React, { useState } from "react";
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
} from "lucide-react";

function HamNav() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const isLoggedIn = !!localStorage.getItem("token");

  // Menu items including Terms & Conditions and Community
  const menuItems = [
    { icon: <User size={20} />, label: "Profile", path: "/profile" },
    { icon: <Briefcase size={20} />, label: "Professional Dashboard", path: "/dashboard" },
    { icon: <Bell size={20} />, label: "Notifications", path: "/notifications" },
    { icon: <MessageSquare size={20} />, label: "Messages", path: "/messages" },
    { icon: <ScrollText size={20} />, label: "Terms & Conditions", path: "/term-and-conditions" },
    { icon: <Globe size={20} />, label: "Community", path: "/community" },
    { icon: <Star size={20} />, label: "Hall of Fame", path: "/hall-of-fame" },
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

  return (
    <div className="bg-gray-50 md:ml-64 ml-0 min-h-screen text-gray-800 transition-all duration-300 flex flex-col justify-between">

      {/* User Section */}
      {isLoggedIn && user && (
        <div className="bg-white p-5 mt-4 mx-4 rounded-2xl shadow-md border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
      )}

      {/* Not Logged In Section */}
      {!isLoggedIn && (
        <div className="bg-white p-5 mt-4 mx-4 rounded-2xl shadow-md text-center border border-gray-100">
          <p className="text-gray-600 text-sm mb-3">You’re not logged in</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full py-2 rounded-xl font-semibold shadow hover:opacity-90 active:scale-95 transition-all"
          >
            Login to Continue
          </button>
        </div>
      )}

      {/* Menu List */}
      <div className="mt-5 bg-white mx-4 rounded-2xl shadow-md border border-gray-100 divide-y divide-gray-100">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 active:scale-[0.98] cursor-pointer transition-all"
          >
            <span className="text-blue-600">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Auth Button */}
      <div className="mt-6 mx-4">
        <button
          onClick={handleAuthClick}
          className={`w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl shadow-md transition-all active:scale-[0.97] ${
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
      <div className="mt-10 mb-5 text-center text-xs text-gray-500">
        AuraMeet © {new Date().getFullYear()} <br /> Made with ❤️ in Nepal 🇳🇵
      </div>
    </div>
  );
}

export default HamNav;
