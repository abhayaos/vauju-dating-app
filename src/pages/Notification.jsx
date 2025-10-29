import React, { useState, useEffect } from "react";
import { BellRing, Check, CheckCheck, Trash2, Sparkles } from "lucide-react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

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
    // Load from localStorage on mount
    const saved = localStorage.getItem("notifications");
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

  // Rive Bell
  const { RiveComponent } = useRive({
    src: "https://cdn.rive.app/animations/bell.riv",
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
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
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <RiveComponent />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Notifications
            </h2>
          </div>

          {unreadCount > 0 && !showAllRead && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-pink-600 bg-pink-100 rounded-full hover:bg-pink-200 transition"
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

        {/* Empty State */}
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <BellRing className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  notif.unread ? "border-pink-200" : "border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Icon + Content */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="relative">
                      {notif.unread ? (
                        <div className="w-9 h-9">
                          <RiveComponent />
                        </div>
                      ) : (
                        <BellRing className="text-pink-500 w-6 h-6" />
                      )}
                      {notif.unread && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-ping" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">
                          {notif.title}
                        </h3>
                        {notif.comingSoon && (
                          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                            <Sparkles size={12} />
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="flex gap-2">
                      {notif.unread && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="hover:text-pink-600 transition"
                          title="Mark as read"
                        >
                          <Check size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="hover:text-red-500 transition"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <span className="text-xs whitespace-nowrap">
                      {getRelativeTime(new Date(notif.timeStamp))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}