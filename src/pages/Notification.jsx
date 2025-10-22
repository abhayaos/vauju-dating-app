import React from "react";
import { BellRing } from "lucide-react";

// Helper function to format relative time
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

function Notification() {
  const notifications = [
    {
      id: 1,
      title: "App Updates! 🎉",
      message:
        "The app is working properly! Note: Messaging feature is currently under maintenance. We're actively fixing it and it will be back soon. Thanks for your patience! 💖",
      timeStamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      unread: true,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center py-8">
      <div className="w-full max-w-3xl px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No notifications yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-white p-4 md:p-5 rounded-xl shadow-md hover:shadow-lg transition flex flex-col sm:flex-row sm:justify-between items-start sm:items-center group"
              >
                {/* Icon + Content */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="relative">
                    <BellRing className="text-pink-500" size={24} />
                    {notif.unread && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-gray-900 text-md sm:text-lg">{notif.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{notif.message}</p>
                  </div>
                </div>

                {/* Timestamp */}
                <span className="text-gray-400 text-xs sm:text-sm mt-2 sm:mt-0">
                  {getRelativeTime(notif.timeStamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Notification;
