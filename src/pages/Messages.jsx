import React, { useState, useEffect } from "react";
import { Search, MessageCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfileImage, handleImageError } from "../utils/imageUtils";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import Header from "../components/Header";

const scrollbarStyles = `
  .lhs-scroll::-webkit-scrollbar {
    width: 8px;
  }
  .lhs-scroll::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  .lhs-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  .lhs-scroll::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  .rhs-scroll::-webkit-scrollbar {
    width: 8px;
  }
  .rhs-scroll::-webkit-scrollbar-track {
    background: #f3f4f6;
  }
  .rhs-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  .rhs-scroll::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

function Messages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    // Empty array - ready for real data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setConversations([]);
    setMessages({});
    setLoading(false);
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
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput("");
    }
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
    <>
      <style>{scrollbarStyles}</style>
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

          {/* Split View Container */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* LHS - Sidebar - Message List */}
            <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-white overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 relative flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>

                {/* Search Bar with Dropdown */}
                <div className="relative z-50">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />

                  {/* Search Results Dropdown */}
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-80 overflow-y-auto z-50"
                      >
                        {filteredConversations.length > 0 ? (
                          filteredConversations.slice(0, 6).map((user) => (
                            <button
                              key={user.id}
                              onClick={() => {
                                handleSelectConversation(user.id);
                                setSearchQuery("");
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="relative flex-shrink-0">
                                <img
                                  src={getProfileImage(user)}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={(e) => handleImageError(e, user.gender)}
                                />
                                {user.isOnline && (
                                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <div className="flex justify-center mb-2">
                              <MessageCircle className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-sm text-gray-500 font-medium">No users available</p>
                            <p className="text-xs text-gray-400 mt-1">Try searching with a different name or email</p>
                          </div>
                        )}
                        {filteredConversations.length > 6 && (
                          <div className="px-4 py-2 text-center text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
                            +{filteredConversations.length - 6} more users
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Filter Tabs */}
              {!searchQuery && (
                <div className="flex gap-2 px-4 pt-3 mt-5 pb-3 mb-4 border-b border-gray-200 overflow-x-auto flex-shrink-0">
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
              )}

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto scroll-smooth lhs-scroll">
                {conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center p-8">
                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                      <MessageCircle className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Conversations</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      No users available yet. Start connecting with people to begin messaging.
                    </p>
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
                        className={`w-full px-4 py-3 text-left transition flex items-center gap-3 border-b border-gray-100 ${
                          selectedConversation === conversation.id
                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={getProfileImage(conversation)}
                            alt={conversation.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => handleImageError(e, conversation.gender)}
                          />
                          {conversation.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {conversation.name}
                            </h3>
                            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                              {conversation.lastMessageTime}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-0.5">
                            {conversation.lastMessage}
                          </p>
                        </div>

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

            {/* RHS - Chat Area */}
            <div className="hidden md:flex flex-1 flex-col bg-white border-l border-gray-200 overflow-hidden">
              {selectedConversation && conversations.find((c) => c.id === selectedConversation) ? (
                <>
                  {/* Chat Header */}
                  <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white flex items-center gap-3">
                    {conversations.find((c) => c.id === selectedConversation) && (
                      <>
                        <div className="relative">
                          <img
                            src={getProfileImage(
                              conversations.find((c) => c.id === selectedConversation)
                            )}
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) =>
                              handleImageError(
                                e,
                                conversations.find((c) => c.id === selectedConversation)
                                  ?.gender
                              )
                            }
                          />
                          {conversations.find((c) => c.id === selectedConversation)
                            ?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {conversations.find((c) => c.id === selectedConversation)
                              ?.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {conversations.find((c) => c.id === selectedConversation)
                              ?.isOnline
                              ? "Active now"
                              : "Away"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Messages Area - Takes remaining space */}
                  <div className="flex-1 overflow-y-auto scroll-smooth rhs-scroll p-4 space-y-3 bg-gray-50 min-h-0">
                    {messages[selectedConversation]?.length > 0 ? (
                      messages[selectedConversation].map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.isOwn
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-900 border border-gray-200"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.isOwn ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-center">
                        <p>No messages yet</p>
                      </div>
                    )}
                  </div>

                  {/* Message Input - Fixed at Bottom */}
                  <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white shadow-lg w-full">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-6 py-3 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition flex items-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 text-center p-6">
                  <div>
                    <MessageCircle className="w-16 h-16 text-gray-300 mb-4 mx-auto" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No conversation selected
                    </h3>
                    <p className="text-gray-500">
                      Choose a conversation from the left to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Messages;
