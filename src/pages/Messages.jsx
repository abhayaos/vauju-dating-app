import React, { useState, useEffect } from "react";
import { MailPlus, Search, X } from "lucide-react";

function Messages() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  // Fetch users when modal opens
  useEffect(() => {
    if (!showModal) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to see users.");
      return;
    }

    setLoading(true);
    setError("");

    fetch("https://backend-vauju-1.onrender.com/api/profile/messages-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users: " + res.status);
        return res.json();
      })
      .then((data) => {
        // Ensure data.users exists
        const fetchedUsers = Array.isArray(data.users) ? data.users : [];
        // simulate loading for 2 sec
        setTimeout(() => {
          setUsers(fetchedUsers);
          setLoading(false);
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [showModal]);

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <main className="flex h-screen bg-white text-black ml-0 md:ml-18">
      {/* Left Sidebar */}
      <section className="w-full md:w-1/3 border-r border-gray-200 flex flex-col relative">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Messages</h2>
          <button
            onClick={() => setShowModal(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <MailPlus className="w-5 h-5 text-gray-600 hover:text-blue-600" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2 mt-3">
            {["All", "Unread", "Groups"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-sm px-4 py-1.5 rounded-full font-medium transition ${
                  activeFilter === filter
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-xs">
            <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              When you start a conversation, it’ll show up here.
            </p>
          </div>
        </div>
      </section>

      {/* Right Chat */}
      <section className="hidden md:flex flex-col flex-1 items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm">
          <h2 className="text-2xl font-bold mb-2">Select a message</h2>
          <p className="text-gray-500 mb-4">
            Choose from your existing conversations or start a new one.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-600 transition flex items-center gap-2 mx-auto"
          >
            <MailPlus className="w-4 h-4" />
            New Message
          </button>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-80 sm:w-96 p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4">Start New Message</h3>

            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 border rounded-full mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-gray-500 text-center">No users found.</p>
            ) : (
              <ul className="max-h-64 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <li
                    key={user._id}
                    className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer flex flex-col"
                    onClick={() => {
                      console.log("Start chat with:", user.username);
                      setShowModal(false);
                    }}
                  >
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-gray-500 text-sm">@{user.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Messages;
