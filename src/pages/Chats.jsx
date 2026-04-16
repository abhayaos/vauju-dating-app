import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Chats() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getChats();
      setChats(data.chats || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChats(); }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading chats...</div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-red-500">{error}</p>
      <button onClick={fetchChats} className="px-4 py-2 bg-black text-white rounded-xl">Retry</button>
    </div>
  );
  if (chats.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 px-4 text-center">
      <p className="text-5xl">💬</p>
      <p className="text-lg font-medium">No conversations yet</p>
      <p className="text-sm">Match with someone to start chatting!</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => navigate(`/chats/${chat._id}`)}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow hover:shadow-md transition cursor-pointer"
          >
            <img src={chat.otherUser?.photos?.[0]} alt={chat.otherUser?.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{chat.otherUser?.name}</p>
              <p className="text-gray-400 text-sm truncate">{chat.lastMessage || "Say hello 👋"}</p>
            </div>
            <span className="text-gray-300 text-xs flex-shrink-0">
              {chat.updatedAt ? new Date(chat.updatedAt).toLocaleDateString() : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
