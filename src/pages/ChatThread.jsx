import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Send } from "lucide-react";
import { api } from "../api";

export default function ChatThread() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendError, setSendError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.getMessages(chatId);
        setMessages(data.messages || []);
        setOtherUser(data.otherUser || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSendError(null);
    const draft = input;
    setInput("");
    try {
      const data = await api.sendMessage(chatId, draft);
      setMessages((prev) => [...prev, data.message]);
    } catch {
      setSendError("Message failed to send.");
      setInput(draft);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>;

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3 p-4 border-b bg-white sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        {otherUser && (
          <div className="flex items-center gap-3">
            <img src={otherUser.photos?.[0]} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover" />
            <span className="font-semibold">{otherUser.name}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId?.toString() === user?._id?.toString();
          return (
            <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMine ? "bg-black text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t bg-white flex gap-3 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full outline-none focus:border-black text-sm"
        />
        <button type="submit" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition">
          <Send size={16} />
        </button>
      </form>
      {sendError && <p className="text-red-500 text-xs text-center pb-2">{sendError}</p>}
    </div>
  );
}
