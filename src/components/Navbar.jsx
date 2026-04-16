import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, User, Settings, MessageCircle, Heart, Newspaper, LogOut } from "lucide-react";
import Logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menu = [
    { name: "Discover", path: "/", icon: <Home size={20} /> },
    { name: "Feed", path: "/feed", icon: <Newspaper size={20} /> },
    { name: "Matches", path: "/matches", icon: <Heart size={20} /> },
    { name: "Chats", path: "/chats", icon: <MessageCircle size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="w-64 h-screen bg-white text-gray-900 flex flex-col justify-between p-5 border-r border-gray-200">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <img src={Logo} alt="YugalMeet" className="h-8 w-auto" />
          <h1 className="text-xl font-bold tracking-wide">
            Yugal<span className="text-pink-500">Meet</span>
          </h1>
        </div>

        <ul className="space-y-2">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200
                  ${isActive
                    ? "bg-pink-50 text-pink-500 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}

export default Navbar;
