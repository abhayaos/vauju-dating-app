// src/components/MobileNavbar.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, MessageCircle, FileImage, Video, Smile, Bell, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MobileNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const API_BASE = import.meta.env.VITE_API_URL || 'https://api.vauju.com';

  // Fetch notification count with error handling
  const fetchNotificationCount = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE}/api/notifications`, {
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

  const handleAlert = () => {
    alert("This feature is coming soon!");
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/friends", icon: UserCheck, label: "Friends" },
    { path: "/matches", icon: Users, label: "Matches" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { 
      path: "/notifications", 
      icon: Bell, 
      label: "Notifications",
      badge: unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount.toString()) : null
    },
  ];

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex justify-between items-center px-0 py-3 w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center relative group transition"
              title={item.label}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                  isActive ? "bg-blue-50 shadow-sm scale-105 text-blue-600" : "text-gray-500 hover:text-blue-500"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
                {item.badge && item.path === "/notifications" && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
        
    </nav>
  );
}

export default MobileNavbar;