import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Bell, Shield } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const sections = [
    { icon: <User size={18} />, label: "Edit Profile", action: () => navigate("/profile") },
    { icon: <Bell size={18} />, label: "Notifications", action: () => {} },
    { icon: <Shield size={18} />, label: "Privacy & Safety", action: () => {} },
  ];

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="bg-white rounded-2xl shadow divide-y">
        {sections.map((s, i) => (
          <button
            key={i}
            onClick={s.action}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition text-left"
          >
            <span className="text-gray-500">{s.icon}</span>
            <span className="text-sm font-medium">{s.label}</span>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 transition rounded-2xl"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
