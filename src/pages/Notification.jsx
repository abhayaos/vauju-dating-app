import React, { useState, useEffect } from "react";
import { BellRing, Check, CheckCheck, Trash2, Sparkles } from "lucide-react";

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
  const [notifications, setNotifications] = useState(() => {
    // Load from sessionStorage on mount (not localStorage)
    const saved = sessionStorage.getItem("notifications");
    if (saved) return JSON.parse(saved);
    
    // Default data if none
    return [
      {
        id: 1,
        title: "App Updates!",
        message:
          "The app is working properly! Note: Messaging feature is currently under maintenance. We're actively fixing it and it will be back soon. Thanks for your patience!",
        timeStamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString(),
        unread: true,
        comingSoon: true,
      },
      {
        id: 2,
        title: "New Match!",
        message: "You've got a new match! Check out their profile and start a conversation.",
        timeStamp: new Date(new Date().getTime() - 30 * 60 * 1000).toISOString(),
        unread: true,
        comingSoon: false,
      },
    ];
  });

  const [showAllRead, setShowAllRead] = useState(false);

  // Save to sessionStorage whenever notifications change
  useEffect(() => {
    sessionStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Auto-refresh time
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const interval = setInterval(() => forceUpdate({}), 30000);
    return () => clearInterval(interval);
  }, []);

  // Actions
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setShowAllRead(true);
    setTimeout(() => setShowAllRead(false), 2000); // Reset after 2s
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

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
                  key={notif.id}
                  className={`p-5 rounded-lg border transition-all duration-200 ${
                    notif.unread 
                      ? "bg-blue-50 border-blue-200" 
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 pt-1">
                      <BellRing className={`w-5 h-5 ${
                        notif.unread ? "text-pink-600" : "text-gray-400"
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                        {notif.comingSoon && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-md">
                            <Sparkles size={12} />
                            Coming Soon
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
                        {getRelativeTime(new Date(notif.timeStamp))}
                      </span>
                      <div className="flex gap-1">
                        {notif.unread && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors duration-200 active:scale-90"
                            title="Mark as read"
                            aria-label="Mark notification as read"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
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