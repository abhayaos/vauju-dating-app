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
  ArrowLeft,
  Shield,
  Search,
  Download,
  Link
} from "lucide-react";
import { getProfileImage, handleImageError } from "../utils/imageUtils";

function HamNav() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [isDataSaverOn, setIsDataSaverOn] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

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

  const toggleDataSaver = () => {
    const newState = !isDataSaverOn;
    setIsDataSaverOn(newState);
    
    // Show custom toast instead of alert
    setToast({
      show: true,
      message: newState ? "Data Saver Enabled: Reducing data consumption" : "Data Saver Disabled",
      type: newState ? "success" : "info"
    });
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInviteFriend = () => {
    // Generate a random referral code
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Create invite URL with referral code
    const inviteUrl = `${window.location.origin}/register?ref=${referralCode}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(inviteUrl)
      .then(() => {
        setToast({
          show: true,
          message: "Invite link copied to clipboard!",
          type: "success"
        });
      })
      .catch(() => {
        // Fallback: show the URL in a toast if copy fails
        setToast({
          show: true,
          message: `Share this link: ${inviteUrl}`,
          type: "info"
        });
      });
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <div className="bg-white min-h-screen flex">
      {/* Desktop Sidebar - Facebook style */}
      <div className="hidden md:block w-60 lg:w-80 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <h1 
            onClick={() => navigate("/")} 
            className="text-2xl font-bold text-blue-600 cursor-pointer"
          >
            Menu
          </h1>
        </div>
        
        <div className="space-y-1">
          {isLoggedIn ? (
            <div 
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate('/blocked/')}
            >
              <img
                src={getProfileImage(user)}
                alt={user?.name || "User"}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => handleImageError(e, user?.gender)}
              />
              <span className="font-medium">{user?.name || "User"}</span>
            </div>
          ) : (
            <div 
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate('/login')}
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
              <span className="font-medium">Guest</span>
            </div>
          )}
          
          {mainMenuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-700"
            >
              <div className="text-blue-600">{item.icon}</div>
              <span>{item.label}</span>
            </div>
          ))}
          
          <div className="border-t border-gray-200 my-2"></div>
          
          <div
            onClick={() => navigate('/blocked/')}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-700 bg-gray-100"
          >
            <Shield className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-gray-900">Blocked Accounts</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className="flex-1 md:hidden">
        {/* Custom Toast Notification */}
        {toast.show && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-white font-medium ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            {toast.message}
          </div>
        )}
        
        {/* Header with user info and back button */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 ml-2">Menu</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate("/search")}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Search size={24} className="text-gray-600" />
              </button>
              <button
                onClick={toggleDataSaver}
                className={`p-2 rounded-full ${isDataSaverOn ? "bg-green-100 text-green-600" : "hover:bg-gray-100 text-gray-600"}`}
              >
                <Download size={24} className={isDataSaverOn ? "text-green-600" : "text-gray-600"} />
              </button>
            </div>
          </div>
          
          {/* Profile Section */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3 mb-3">
              {isLoggedIn ? (
                <div 
                  className="relative cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  <img
                    src={getProfileImage(user)}
                    alt={user?.name || "User"}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                    onError={(e) => handleImageError(e, user?.gender)}
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              ) : (
                <div 
                  className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 cursor-pointer"
                  onClick={() => navigate('/login')}
                />
              )}
              
              <div>
                <h2 className="font-bold text-lg text-gray-900">
                  {isLoggedIn ? user?.name || "User" : "Guest"}
                </h2>
                <p className="text-sm text-gray-500">
                  {isLoggedIn ? "Online" : "Not logged in"}
                </p>
              </div>
            </div>
            
            <div 
              onClick={() => navigate('/profile')}
              className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">View Your Profile</span>
                <Link size={16} className="text-gray-500" />
              </div>
            </div>
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
                <User size={24} className="text-blue-600" />
              </div>
              <span className="text-xs text-gray-700">Profile</span>
            </div>
            <div 
              onClick={() => navigate("/matches")}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="bg-gray-100 p-3 rounded-lg mb-1">
                <Heart size={24} className="text-red-500" />
              </div>
              <span className="text-xs text-gray-700">Matches</span>
            </div>
            <div 
              onClick={() => navigate("/messages")}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="bg-gray-100 p-3 rounded-lg mb-1">
                <MessageSquare size={24} className="text-green-500" />
              </div>
              <span className="text-xs text-gray-700">Messages</span>
            </div>
            <div 
              onClick={() => navigate("/notifications")}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="bg-gray-100 p-3 rounded-lg mb-1">
                <Bell size={24} className="text-yellow-500" />
              </div>
              <span className="text-xs text-gray-700">Alerts</span>
            </div>
          </div>
        </div>

        {/* Invite Friend Section */}
        <div className="p-4 border-b border-gray-200">
          <div 
            onClick={handleInviteFriend}
            className="flex items-center space-x-3 p-3 rounded-lg bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200 transition"
          >
            <Heart size={24} className="text-gray-600" />
            <span className="font-medium">Invite Friend</span>
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
                <span className="text-gray-800 text-lg">{item.label}</span>
              </div>
            ))}
            
            {/* Blocked Accounts Section */}
            <div
              onClick={() => navigate('/blocked/')}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer bg-red-50 border border-red-100"
            >
              <Shield className="h-6 w-6 text-red-600" />
              <span className="text-red-700 font-medium text-lg">Blocked Accounts</span>
            </div>
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
                <span className="text-gray-800 text-lg">{item.label}</span>
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
                <span className="text-gray-800 text-lg">{item.label}</span>
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
                <span className="text-gray-800 text-lg">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logout/Login Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleAuthClick}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-lg ${
              isLoggedIn
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            {isLoggedIn ? (
              <>
                <LogOut size={24} />
                <span>Logout</span>
              </>
            ) : (
              <>
                <LogIn size={24} />
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
    </div>
  );
}

export default HamNav;