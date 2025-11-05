import React, { useState, useEffect } from "react";
import { Search, MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getProfileImage, handleImageError } from "../utils/imageUtils";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import Header from "../components/Header";

const API_BASE = "https://backend-vauju-1.onrender.com";

function Messages() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedConversation, setSelectedConversation] = useState(userId || null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, [token]);

  const fetchConversations = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch conversations");

      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const nameMatch = (conv.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const emailMatch = (conv.email || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
    navigate(`/messages/${conversationId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col md:pl-[70px] w-full">
          <div className="md:hidden sticky top-0 z-50 bg-white shadow-sm">
            <Header />
          </div>
          <div className="md:hidden sticky top-[64px] z-40 bg-white shadow-sm">
            <MobileNavbar />
          </div>
          <div className="animate-pulse flex-1 flex flex-col">
            <div className="h-16 bg-gray-100" />
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-48" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-[70px] w-full">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-50 bg-white shadow-sm">
          <Header />
        </div>
        <div className="md:hidden sticky top-[64px] z-40 bg-white shadow-sm">
          <MobileNavbar />
        </div>

        {/* Messages Container */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar - Message List */}
          <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search conversations"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 px-4 pt-3 mt-5 pb-3 mb-4 border-b border-gray-200 overflow-x-auto">
              {["inbox", "requests", "archived"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    activeTab === tab
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                  <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-center">No conversations found</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredConversations.map((conversation) => (
                    <motion.button
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ backgroundColor: "#f7f7f7" }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-100 ${
                        selectedConversation === conversation.id
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      {/* Avatar with Online Indicator */}
                      <div className="relative flex-shrink-0">
                          src={getProfileImage(conversation)}
                          alt={conversation.name}
                          onError={(e) => handleImageError(e, conversation.gender)}
                        {conversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>

                      {/* Message Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {conversation.lastMessageTime || ""}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-0.5">
                          {conversation.lastMessage}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {conversation.unread > 0 && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 font-semibold">
                          {conversation.unread}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 text-center p-6">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedConversation ? "Select a conversation" : "No conversation selected"}
            </h3>
            <p className="text-gray-500">
              {selectedConversation
                ? "Chat feature coming soon!"
                : "Choose a conversation from the sidebar to start messaging"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
