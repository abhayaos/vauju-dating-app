import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Settings,
  LogOut
} from "lucide-react";
import Logo from "../assets/logo.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="w-64 h-screen bg-white text-gray-900 flex flex-col justify-between p-5 border-r border-gray-200">

      {/* 🔥 Logo */}
      <div>
        <div className="flex items-center gap-3 mb-10">
          <img src={Logo} alt="Yugal Meet" className="h-8 w-auto" />
          <h1 className="text-xl font-bold tracking-wide">
            Yugal<span className="text-blue-600">Meet</span>
          </h1>
        </div>

        {/* 📌 Menu */}
        <ul className="space-y-2">
          {menu.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
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

      {/* 🚪 Logout */}
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