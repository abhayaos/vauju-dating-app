import React, { useState, useEffect, useCallback } from "react";
import { BellRing, Check, CheckCheck, Trash2, Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Helper: Format relative time
function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${diffDay}d ago`;
}

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllRead, setShowAllRead] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { token } = useAuth();
  
  const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-vauju-1.onrender.com';

  // Fetch notifications from API with retry logic
  const fetchNotifications = useCallback(async (attempt = 1) => {
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

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setNotifications(data);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error("Request timeout while fetching notifications");
        toast.error("Request timeout. Please check your connection.");
      } else {
        console.error("Error fetching notifications:", error);
        
        // Retry logic for network errors
        if (attempt < 3) {
          console.log(`Retrying attempt ${attempt + 1} of 3`);
          toast(`Having trouble loading data... Retrying attempt ${attempt + 1} of 3`, {
            icon: '🔄',
            duration: 2000
          });
          
          // Exponential backoff: 1s, 2s, 4s delays
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return fetchNotifications(attempt + 1);
        } else {
          toast.error("Failed to load notifications. Please try again later.");
        }
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [token]);

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (!loading) {
        fetchNotifications();
      }
    }, 30000);
    
    // Listen for real-time notifications
    const handleRealTimeNotification = (event) => {
      // Add the new notification to the top of the list
      const newNotification = {
        _id: Date.now().toString(),
        type: event.detail.type,
        title: event.detail.title,
        message: event.detail.message,
        timestamp: event.detail.timestamp,
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      toast.success(event.detail.title);
    };
    
    window.addEventListener('notification', handleRealTimeNotification);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('notification', handleRealTimeNotification);
    };
  }, [fetchNotifications, loading]);

  // Auto-refresh time
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const interval = setInterval(() => forceUpdate({}), 30000);
    return () => clearInterval(interval);
  }, []);

  // Manual retry function
  const handleRetry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    await fetchNotifications();
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      const data = await response.json();
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? data.notification : n))
      );
      
      // Dispatch custom event for navbar badge update
      window.dispatchEvent(new CustomEvent('notificationUpdate'));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setShowAllRead(true);
      setTimeout(() => setShowAllRead(false), 2000); // Reset after 2s
      
      // Dispatch custom event for navbar badge update
      window.dispatchEvent(new CustomEvent('notificationUpdate'));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Loading state
  if (loading && retryCount === 0) {
    return (
      <main className="min-h-screen bg-white md:ml-[70px]">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
            <div className="px-4 md:px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 animate-pulse"></div>
                </div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-4 md:px-6 py-6">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1">
                      <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-3 w-full bg-gray-200 rounded mb-1 animate-pulse"></div>
                      <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex gap-1">
                        <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state with retry option
  if (!loading && notifications.length === 0 && retryCount > 0) {
    return (
      <main className="min-h-screen bg-white md:ml-[70px]">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
            <div className="px-4 md:px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <BellRing className="w-10 h-10 text-pink-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              </div>
            </div>
          </div>

          {/* Error Content Section */}
          <div className="px-4 md:px-6 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <BellRing className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load notifications</h3>
              <p className="text-gray-500 mb-6">
                Having trouble connecting to the server. Please check your connection and try again.
              </p>
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </button>
              <p className="text-gray-400 text-xs mt-4">
                Attempt {retryCount} of 3
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white md:ml-[70px]">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
          <div className="px-4 md:px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <BellRing className="w-10 h-10 text-pink-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            </div>

            {unreadCount > 0 && !showAllRead && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors duration-200 active:scale-95"
              >
                <CheckCheck size={18} />
                Mark All Read
              </button>
            )}

            {showAllRead && (
              <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                <CheckCheck size={18} />
                All marked as read!
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 md:px-6 py-6">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <BellRing className="h-16 w-16 text-gray-300" />
              </div>
              <p className="text-gray-600 text-lg font-medium">No notifications yet</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for updates</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-5 rounded-lg border transition-all duration-200 ${
                    !notif.read 
                      ? "bg-blue-50 border-blue-200" 
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 pt-1">
                      <BellRing className={`w-5 h-5 ${
                        !notif.read ? "text-pink-600" : "text-gray-400"
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                        {notif.type === "daily_match" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-md">
                            <Sparkles size={12} />
                            Daily Match
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed break-words">
                        {notif.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {getRelativeTime(new Date(notif.timestamp))}
                      </span>
                      <div className="flex gap-1">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif._id)}
                            className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors duration-200 active:scale-90"
                            title="Mark as read"
                            aria-label="Mark notification as read"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200 active:scale-90"
                          title="Delete"
                          aria-label="Delete notification"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}