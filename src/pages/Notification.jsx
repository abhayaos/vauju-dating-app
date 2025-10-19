import React from 'react'
import { BellRing } from 'lucide-react'

function Notification() {
  // Example notifications
  const notifications = [
    { id: 1, title: "App updates!", message: "he app is working properly! 🎉 Note: Messaging feature is currently under maintenance. We're actively fixing it and it will be back soon. Thanks for your patience! 💖.", time: "2h ago" },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className='p-4 ml-0 md:ml-18 max-w-3xl mx-auto'>
      

        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between items-start sm:items-center"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <BellRing className="text-pink-500" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    <p className="text-gray-600 text-sm">{notif.message}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-xs mt-2 sm:mt-0">{notif.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Notification
