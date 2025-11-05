// src/MobileLayouyt/HamNav.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Home, 
  User, 
  MessageCircle, 
  Heart, 
  Users, 
  Globe, 
  BookOpen, 
  HelpCircle, 
  LogOut,
  X,
  Shield,
  Award,
  Settings,
  DollarSign,
  Lock,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

function HamNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("main");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: Heart, label: "Matches", path: "/matches" },
    { icon: Users, label: "Friends", path: "/friends" },
    { icon: Globe, label: "Explore", path: "/explore" },
    { icon: BookOpen, label: "Blogs", path: "/blogs" },
    { icon: Award, label: "Hall of Fame", path: "/hall-of-fame" },
    { icon: Globe, label: "Community", path: "/community" },
    { icon: DollarSign, label: "Buy Coins", path: "/buy-coins" },
    { icon: HelpCircle, label: "Support", path: "/support" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const legalItems = [
    { label: "Terms & Conditions", path: "/term-and-conditions" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Community Guidelines", path: "/community-guidelines" },
  ];

  const contactItems = [
    { icon: Mail, label: "support@yugameet.com", path: "mailto:support@yugameet.com" },
    { icon: Phone, label: "+977-98XXXXXXXX", path: "tel:+97798XXXXXXXX" },
    { icon: MapPin, label: "Kathmandu, Nepal", path: "#" },
  ];

  const renderMainMenu = () => (
    <div className="space-y-1">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="flex items-center px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <item.icon className="mr-3 h-5 w-5 text-gray-500" />
          {item.label}
        </Link>
      ))}
      
      <div className="pt-4 mt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  const renderLegalMenu = () => (
    <div className="space-y-1">
      <button
        onClick={() => setActiveSection("main")}
        className="flex items-center px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
      >
        <span className="mr-3">←</span> Back
      </button>
      
      <div className="pt-4 mt-4 border-t border-gray-200">
        <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Legal</h3>
        {legalItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="block px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );

  const renderContactMenu = () => (
    <div className="space-y-1">
      <button
        onClick={() => setActiveSection("main")}
        className="flex items-center px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
      >
        <span className="mr-3">←</span> Back
      </button>
      
      <div className="pt-4 mt-4 border-t border-gray-200">
        <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact Us</h3>
        {contactItems.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className="flex items-center px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <item.icon className="mr-3 h-5 w-5 text-gray-500" />
            {item.label}
          </a>
        ))}
      </div>
      
      <div className="pt-4 mt-4 border-t border-gray-200">
        <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Security</h3>
        <Link
          to="/privacy-policy"
          className="flex items-center px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Shield className="mr-3 h-5 w-5 text-gray-500" />
          Privacy & Security
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-900">YugalMeet</h1>
            {user && (
              <p className="text-sm text-gray-500">{user.name || user.username}</p>
            )}
          </div>
        </div>
        <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
          <X className="h-6 w-6 text-gray-500" />
        </Link>
      </div>

      {/* Menu Content */}
      <div className="p-4">
        {activeSection === "main" && renderMainMenu()}
        {activeSection === "legal" && renderLegalMenu()}
        {activeSection === "contact" && renderContactMenu()}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setActiveSection("legal")}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Legal
          </button>
          <button
            onClick={() => setActiveSection("contact")}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Contact
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} YugalMeet. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default HamNav;