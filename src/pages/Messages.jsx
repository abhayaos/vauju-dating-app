import React, { useState, useEffect, useRef } from "react";
import { Search, MessageCircle, Wifi, WifiOff, Send, X, Check, CheckCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getProfileImage, handleImageError } from "../utils/imageUtils";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { apiFetch, API_ENDPOINTS } from "../utils/apiConfig";
import ProfessionalUrlPreview from "../components/ProfessionalUrlPreview";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import Header from "../components/Header";
import io from "socket.io-client";

// Use environment variable for API URL or fallback to proxy
const API_BASE = import.meta.env.VITE_API_URL || "/api";

// Helper function to render message text with URL previews
const renderMessageWithPreviews = (text) => {
  if (!text) return null;
  
  // Split text by URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    // Check if this part is a URL
    if (part && part.match && part.match(/^https?:\/\/[^\s]+$/)) {
      // This is a URL, render a preview
      return <ProfessionalUrlPreview key={`url-${index}`} url={part} />;
    } else {
      // Regular text
      return <span key={`text-${index}`}>{part || ''}</span>;
    }
  });
};

function Messages() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { token, user: currentUser } = useAuth();
  const isOnline = useOnlineStatus();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedConversation, setSelectedConversation] = useState(userId || null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalConversations, setTotalConversations] = useState(0);
  const conversationsPerPage = 6;
  // Search states
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Redirect to home if offline
  useEffect(() => {
    if (!isOnline) {
      // Show offline message for 2 seconds before redirecting
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, navigate]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (token && isOnline) {
      const newSocket = io(API_BASE, {
        transports: ["websocket"],
        auth: { token }
      });

      newSocket.on("connect", () => {
        console.log("Connected to socket");
        // Authenticate with the server
        newSocket.emit("authenticate", token);
      });

      newSocket.on("message", (message) => {
        // Handle incoming messages
        if (message && message.from && message.to) {
          // Check if this message is for the current conversation
          if ((String(message.from) === selectedConversation && String(message.to) === String(currentUser._id)) ||
              (String(message.to) === selectedConversation && String(message.from) === String(currentUser._id))) {
            setMessages(prev => {
              // Check if message already exists
              const exists = prev.some(m => m._id === message._id);
              if (!exists) {
                return [...prev, message].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
              }
              return prev;
            });
          }
          
          // Update conversations list if needed
          setConversations(prev => prev.map(conv => {
            if (conv.id === message.from || conv.id === message.to) {
              return {
                ...conv,
                lastMessage: message.text,
                lastMessageTime: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
            }
            return conv;
          }));
        }
      });

      newSocket.on("messages", (newMessages) => {
        if (Array.isArray(newMessages)) {
          setMessages(prev => {
            const updatedMessages = [...prev];
            newMessages.forEach(msg => {
              const exists = updatedMessages.some(m => m._id === msg._id);
              if (!exists) {
                updatedMessages.push(msg);
              }
            });
            return updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          });
        }
      });

      newSocket.on("presence", (data) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (data.online) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from socket");
      });

      setSocket(newSocket);

      // Send heartbeat to update presence
      const heartbeatInterval = setInterval(() => {
        if (newSocket.connected) {
          newSocket.emit("heartbeat");
        }
      }, 30000);

      return () => {
        newSocket.close();
        clearInterval(heartbeatInterval);
      };
    }
  }, [token, isOnline, selectedConversation, currentUser._id]);

  useEffect(() => {
    if (isOnline) {
      fetchConversations(currentPage);
    } else {
      setLoading(false);
    }
  }, [token, isOnline, currentPage]);

  useEffect(() => {
    if (selectedConversation && token) {
      fetchMessages(selectedConversation);
    } else {
      setMessages([]);
    }
  }, [selectedConversation, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async (page = 1) => {
    if (!token || !isOnline) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/messages/conversations?page=${page}&limit=${conversationsPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch conversations");

      const data = await res.json();
      
      // Process conversations to add necessary fields
      let processedConversations = [];
      let total = 0;
      let pages = 1;
      
      if (Array.isArray(data.conversations)) {
        processedConversations = data.conversations.map(conv => ({
          ...conv,
          id: conv._id || conv.id,
          name: conv.name || conv.username || "Unknown User",
          lastMessageTime: conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ""
        }));
        total = data.total || data.conversations.length;
        pages = data.totalPages || Math.ceil(total / conversationsPerPage);
      } else if (Array.isArray(data)) {
        // Fallback for old API format
        processedConversations = data.map(conv => ({
          ...conv,
          id: conv._id || conv.id,
          name: conv.name || conv.username || "Unknown User",
          lastMessageTime: conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ""
        }));
        total = data.length;
        pages = Math.ceil(total / conversationsPerPage);
      }
      
      setConversations(processedConversations);
      setTotalConversations(total);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
      setTotalConversations(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    if (!token || !isOnline) return;

    setMessageLoading(true);
    try {
      const res = await fetch(`${API_BASE}/messages/conversation/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setMessageLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !token) return;

    try {
      // Create temporary message for immediate display
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        from: currentUser._id,
        to: selectedConversation,
        text: newMessage.trim(),
        createdAt: new Date(),
        seen: false
      };

      // Add to local messages immediately for better UX
      setMessages(prev => [...prev, tempMessage]);
      
      // Clear input
      setNewMessage("");

      // Send message via API
      const response = await fetch(`${API_BASE}/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: selectedConversation,
          text: newMessage.trim()
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const sentMessage = await response.json();
      
      // Replace temporary message with actual message
      setMessages(prev => 
        prev.map(msg => 
          msg._id === tempMessage._id ? sentMessage : msg
        )
      );
      
      // Update conversations list
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            lastMessage: sentMessage.text,
            lastMessageTime: new Date(sentMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return conv;
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove temporary message if failed
      setMessages(prev => prev.filter(msg => !msg._id.startsWith('temp-')));
      // Show error to user
      alert("Failed to send message. Please try again.");
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Search users function - fetch all users with delay
  const searchUsers = async (query) => {
    if (!token) return;
    
    // Don't search if query is empty
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    setSearchError(null);
    
    try {
      // Use the /api/users/search endpoint for searching users
      const data = await apiFetch(`${API_ENDPOINTS.SEARCH_USERS}?query=${encodeURIComponent(query || '')}`, {
        method: 'GET'
      }, token);
      
      console.log('Search API response:', data);
      
      // Process search results to match conversation format
      let processedResults = [];
      
      // Handle different response formats
      if (Array.isArray(data)) {
        // Direct array response
        processedResults = data.map(user => ({
          ...user,
          id: user._id || user.id,
          name: user.name || user.username || "Unknown User",
        }));
      } else if (data && Array.isArray(data.users)) {
        // Object with users array
        processedResults = data.users.map(user => ({
          ...user,
          id: user._id || user.id,
          name: user.name || user.username || "Unknown User",
        }));
      } else if (data && Array.isArray(data.results)) {
        // Object with results array
        processedResults = data.results.map(user => ({
          ...user,
          id: user._id || user.id,
          name: user.name || user.username || "Unknown User",
        }));
      }
      
      console.log('Processed search results:', processedResults);
      setSearchResults(processedResults);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchError(`Failed to search users: ${error.message || 'Please try again.'}`);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const query = e.target.value;
    console.log('Search query changed:', query);
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout to debounce search (even for empty query to show all users)
    searchTimeoutRef.current = setTimeout(() => {
      console.log('Performing search for:', query || 'all users');
      searchUsers(query);
    }, 300);
  };

  // Pagination functions
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Show offline message
  if (!isOnline) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col md:pl-[70px] w-full">
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-6 max-w-md"
            >
              <WifiOff className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Internet Connection
              </h2>
              <p className="text-gray-600 mb-4">
                Messages require an active internet connection. Please check your connection and try again.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to home page...
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col md:pl-[70px] w-full">
     
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
      {/* Connection Status Indicator */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 bg-red-50 border-b border-red-200 p-3 z-50 flex items-center justify-center gap-2"
        >
          <WifiOff className="w-4 h-4 text-red-600" />
          <span className="text-red-700 font-medium">No internet connection</span>
        </motion.div>
      )}

      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Navbar - Show on mobile devices */}
      <div className="md:hidden">
        <MobileNavbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-[70px] w-full" style={!isOnline ? { marginTop: '56px' } : {}}>
        {/* Removed mobile header */}
        
        {/* Messages Container */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar - Message List */}
          <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 relative">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
              
              {/* Search Bar */}
              <div className="relative z-50">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users to message"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {(searchQuery || searchResults.length > 0 || searching) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-96 overflow-y-auto z-50"
                    >
                      {searching ? (
                        <div className="px-4 py-3 text-center text-sm text-gray-500">
                          Searching users...
                        </div>
                      ) : searchError ? (
                        <div className="px-4 py-3 text-center text-sm text-red-500">
                          {searchError}
                        </div>
                      ) : (
                        <>
                          {/* Debug info */}
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                            DEBUG: conv={filteredConversations.length}, users={searchResults.length}
                          </div>
                          
                          {/* Existing conversations that match search */}
                          {filteredConversations.length > 0 && (
                            <>
                              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                                CONVERSATIONS
                              </div>
                              {filteredConversations.slice(0, 5).map((conversation) => (
                                <button
                                  key={conversation.id}
                                  onClick={() => {
                                    handleSelectConversation(conversation.id);
                                    setSearchQuery("");
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="relative flex-shrink-0">
                                    <img
                                      src={getProfileImage(conversation)}
                                      alt={conversation.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                      onError={(e) => handleImageError(e, conversation.gender)}
                                    />
                                    {onlineUsers.has(conversation.id) && (
                                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                      {conversation.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {conversation.email}
                                    </p>
                                  </div>
                                </button>
                              ))}
                              {filteredConversations.length > 5 && (
                                <div className="px-4 py-2 text-center text-xs text-gray-500 border-b border-gray-100">
                                  +{filteredConversations.length - 5} more conversations
                                </div>
                              )}
                            </>
                          )}
                          
                          {/* Search results from API */}
                          {searchResults.length > 0 ? (
                            <>
                              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-t border-gray-100">
                                USERS
                              </div>
                              {searchResults.slice(0, 5).map((user) => (
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
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                      {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {user.username || user.email}
                                    </p>
                                  </div>
                                </button>
                              ))}
                              {searchResults.length > 5 && (
                                <div className="px-4 py-2 text-center text-xs text-gray-500 border-b border-gray-100">
                                  +{searchResults.length - 5} more users
                                </div>
                              )}
                            </>
                          ) : !searching && (
                            // Show message when no users found
                            <div className="px-4 py-3 text-center text-sm text-gray-500 border-t border-gray-100">
                              {searchQuery ? `No users found matching "${searchQuery}"` : 'No users available'}
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Filter Tabs - Hidden when searching */}
            {!searchQuery && (
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
            )}

            {/* Conversations List - Show search results or normal list */}
            <div className="flex-1 overflow-y-auto">
              {!searchQuery && conversations.length === 0 ? (
                /* No conversations state */
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                  <MessageCircle className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-center font-medium text-gray-700 mb-1">
                    No conversations yet
                  </p>
                  <p className="text-sm text-gray-500 text-center max-w-xs">
                    Start a new conversation to begin messaging
                  </p>
                </div>
              ) : !searchQuery ? (
                /* Normal conversations list */
                <>
                  <AnimatePresence>
                    {conversations.map((conversation) => (
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
                          <img
                            src={getProfileImage(conversation)}
                            alt={conversation.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => handleImageError(e, conversation.gender)}
                          />
                          {onlineUsers.has(conversation.id) && (
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center p-4 border-t border-gray-200">
                      <nav className="flex items-center gap-2">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                            currentPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-sm"
                          }`}
                        >
                          Previous
                        </button>

                        {/* Page numbers */}
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => paginate(pageNumber)}
                                className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                                  currentPage === pageNumber
                                    ? "bg-blue-500 text-white shadow-sm"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-sm"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          } else if (
                            (pageNumber === currentPage - 2 && currentPage > 3) ||
                            (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                          ) {
                            return (
                              <span key={pageNumber} className="px-1 py-1.5 text-gray-500 text-sm">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}

                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                            currentPage === totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-sm"
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col bg-white">
              {/* Chat Header */}
              {conversations.find(c => c.id === selectedConversation) && (
                <div className="border-b border-gray-200 p-4 flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <img
                      src={getProfileImage(conversations.find(c => c.id === selectedConversation))}
                      alt={conversations.find(c => c.id === selectedConversation)?.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => handleImageError(e, conversations.find(c => c.id === selectedConversation)?.gender)}
                    />
                    {onlineUsers.has(selectedConversation) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {conversations.find(c => c.id === selectedConversation)?.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {onlineUsers.has(selectedConversation) ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              )}

              {/* Messages Container */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-50"
              >
                {messageLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse">Loading messages...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium text-gray-700 mb-1">
                      No messages yet
                    </p>
                    <p className="text-gray-500">
                      Start a conversation by sending a message
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const isOwnMessage = String(message.from) === String(currentUser._id);
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                            }`}
                          >
                            <p className="text-sm">
                              {renderMessageWithPreviews(message.text)}
                            </p>
                            <div className={`flex items-center justify-end gap-1 mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
                              <span className="text-xs">
                                {formatTime(message.createdAt)}
                              </span>
                              {isOwnMessage && (
                                message.seen ? (
                                  <CheckCheck className="w-4 h-4" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <form onSubmit={sendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    disabled={!isOnline}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !isOnline}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 text-center p-6">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;