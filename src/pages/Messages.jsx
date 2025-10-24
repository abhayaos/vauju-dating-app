import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MailPlus, Search, X, Send, UserCircle2, Circle, ArrowLeft } from "lucide-react";
import { io as ioClient } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode"; // Use named import
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

const API_URL = "https://backend-vauju-1.onrender.com";
const USERS_CACHE_KEY = "messages-users";

const getSortTimestamp = (user = {}) => {
  const candidates = [
    user.lastMessageAt,
    user.lastMessage?.createdAt,
    user.lastMessage?.timestamp,
    user.lastMessageTimestamp,
    user.updatedAt,
    user.createdAt,
  ];
  for (const value of candidates) {
    if (!value) continue;
    const ts = new Date(value).getTime();
    if (!Number.isNaN(ts)) return ts;
  }
  return 0;
};

const sortUsersByRecent = (list) => {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));
};

function Messages() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherIsTyping, setOtherIsTyping] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const convoRef = useRef(null);
  const socketRef = useRef(null);
  const presenceTimeoutRef = useRef({});
  const typingTimeoutRef = useRef(null);
  const selectedUserRef = useRef(null);
  const cacheRef = useRef(new Map());

  const applyUsersUpdate = useCallback(
    (updater) => {
      setUsers((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        if (!Array.isArray(next)) return prev;
        const sorted = sortUsersByRecent(next);
        cacheRef.current.set(USERS_CACHE_KEY, sorted);
        return sorted;
      });
    },
    [cacheRef]
  );

  // Request Notification Permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          console.log("✅ Notifications enabled");
        }
      });
    }
  }, []);

  // Handle logout/token removal - cleanup socket
  useEffect(() => {
    const handleLogout = () => {
      console.log("📤 Logging out - disconnecting socket and clearing messages");
      if (socketRef.current) {
        socketRef.current.off("message");
        socketRef.current.off("seen");
        socketRef.current.off("presence");
        socketRef.current.off("typing");
        socketRef.current.off("matchNotification");
        socketRef.current.off("authError");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      Object.values(presenceTimeoutRef.current).forEach(clearTimeout);
      presenceTimeoutRef.current = {};
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setMessages([]);
      setSelectedUser(null);
      applyUsersUpdate(() => []);
    };

    const handleStorageChange = (e) => {
      if (e.key === "token" && !e.newValue) {
        handleLogout();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleLogout);
    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleLogout);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  // Fetch users and online status
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const cached = cacheRef.current.get(USERS_CACHE_KEY);
        if (cached && Array.isArray(cached) && cached.length > 0) {
          applyUsersUpdate(cached);
          return;
        }

        const res = await fetch(`${API_URL}/api/profile/messages-users`, {
          headers: { "x-user-id": token },
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Please login again");
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(`Server error: ${res.status}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned HTML instead of JSON. Check backend.");
        }

        const data = await res.json();
        const list = sortUsersByRecent(Array.isArray(data) ? data : []);
        cacheRef.current.set(USERS_CACHE_KEY, list);

        let onlineIds = [];
        try {
          const onlineRes = await fetch(`${API_URL}/api/messages/online-users`, {
            headers: { "x-user-id": token },
          });
          if (onlineRes.ok) onlineIds = await onlineRes.json();
        } catch (e) {
          console.warn("Online users fetch failed:", e);
        }

        const onlineSet = new Set((onlineIds || []).map(String));
        applyUsersUpdate(list.map((u) => ({ isOnline: onlineSet.has(String(u._id)), ...u })));
      } catch (err) {
        console.error("Users fetch error:", err);
        toast.error("Failed to fetch users: " + (err.message || "unknown"));
        setError(err.message);
      }
    };
    fetchUsers();
  }, [navigate]);

  // Handle user selection based on URL params
  useEffect(() => {
    if (!params.userId) {
      setSelectedUser(null);
      selectedUserRef.current = null;
      setMessages([]);
      Object.values(presenceTimeoutRef.current).forEach(clearTimeout);
      presenceTimeoutRef.current = {};
      return;
    }
    const u = users.find((x) => String(x._id) === String(params.userId));
    if (!u) return;
    if (selectedUserRef.current && String(selectedUserRef.current._id) === String(u._id)) return;
    handleSelectUser(u);
  }, [params.userId, users]);

  useEffect(() => {
    if (!users.length || !params.userId) return;
    const target = users.find((x) => String(x._id) === String(params.userId));
    if (!target) return;
    if (selectedUserRef.current && String(selectedUserRef.current._id) === String(target._id)) return;
    handleSelectUser(target);
  }, [users, params.userId]);

  useEffect(() => {
    if (!selectedUserRef.current) return;
    const match = users.find((u) => String(u._id) === String(selectedUserRef.current._id));
    if (match && match !== selectedUserRef.current) {
      selectedUserRef.current = match;
      setSelectedUser(match);
    }
  }, [users]);

  // Heartbeat for presence
  useEffect(() => {
    const doBeat = async () => {
      try {
        const me = getMeId();
        if (!me) return;
        await fetch(`${API_URL}/api/messages/heartbeat`, {
          method: "POST",
          headers: { "x-user-id": me },
        });
      } catch {}
    };
    doBeat();
    const t = setInterval(doBeat, 30000);
    return () => clearInterval(t);
  }, []);

  // Socket.IO setup
  useEffect(() => {
    const me = getMeId();
    if (!me || !selectedUser) return;

    if (socketRef.current) {
      socketRef.current.off("message");
      socketRef.current.off("seen");
      socketRef.current.off("presence");
      socketRef.current.off("typing");
      socketRef.current.off("matchNotification");
      socketRef.current.off("authError");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = ioClient(API_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    const identify = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          socket.disconnect();
          return;
        }
        socket.emit("identify", me);
        socket.emit("presence", { userId: me, online: true });
      } catch {}
    };

    socket.on("connect", identify);
    socket.io?.on?.("reconnect", identify);
    socket.on("connect_error", (err) =>
      console.warn("Socket connect_error", err?.message || err)
    );
    
    // Handle auth errors (e.g., expired token)
    socket.on("authError", (data) => {
      console.error("Socket auth error:", data);
      socket.disconnect();
    });

    socket.on("message", (m) => {
      const meId = String(me);
      const senderId = String(m.from);
      const otherId = senderId === meId ? String(m.to) : senderId;
      const messageTime = m.createdAt || m.timestamp || m.lastMessageAt || Date.now();
      const messageText = m.text || "";

      if (
        selectedUser &&
        (String(m.from) === String(selectedUser._id) ||
          String(m.to) === String(selectedUser._id))
      ) {
        setMessages((prev) => [...prev, m]);
        if (String(m.from) === String(selectedUser._id)) {
          fetch(`${API_URL}/api/messages/seen/${m._id}`, {
            method: "PUT",
            headers: { "x-user-id": me },
          });
        }
      }

      if (senderId !== meId && "Notification" in window && Notification.permission === "granted") {
        const sender = users.find((u) => String(u._id) === senderId);
        const title = sender ? `${sender.name} sent a message` : "New Message";
        const body = messageText || "You’ve got a new message!";
        const notif = new Notification(title, {
          body,
          icon: "/logo192.png",
        });
        notif.onclick = () => {
          window.focus();
          navigate(`/messages/${m.from}`);
        };
      }

      applyUsersUpdate((prev) =>
        prev.map((u) => {
          const id = String(u._id);
          if (id === senderId && senderId !== meId) {
            if (presenceTimeoutRef.current[u._id]) {
              clearTimeout(presenceTimeoutRef.current[u._id]);
            }
            presenceTimeoutRef.current[u._id] = setTimeout(() => {
              applyUsersUpdate((prevUsers) =>
                prevUsers.map((user) =>
                  String(user._id) === String(u._id)
                    ? { ...user, isOnline: false }
                    : user
                )
              );
            }, 35000);
            return {
              ...u,
              isOnline: true,
              lastMessage: messageText,
              lastMessageAt: messageTime,
              lastMessageTimestamp: messageTime,
            };
          }
          if (id === otherId) {
            return {
              ...u,
              lastMessage: messageText,
              lastMessageAt: messageTime,
              lastMessageTimestamp: messageTime,
            };
          }
          return u;
        })
      );
    });

    socket.on("seen", (m) => {
      setMessages((prev) =>
        prev.map((x) => (x._id === m._id ? { ...x, seen: true } : x))
      );
    });

    socket.on("presence", ({ userId, online }) => {
      applyUsersUpdate((prev) =>
        prev.map((u) => {
          if (String(u._id) === String(userId)) {
            if (online && presenceTimeoutRef.current[u._id]) {
              clearTimeout(presenceTimeoutRef.current[u._id]);
            }
            if (!online) {
              presenceTimeoutRef.current[u._id] = setTimeout(() => {
                applyUsersUpdate((prevUsers) =>
                  prevUsers.map((user) =>
                    String(user._id) === String(userId)
                      ? { ...user, isOnline: false }
                      : user
                  )
                );
              }, 5000);
            }
            return { ...u, isOnline: Boolean(online) };
          }
          return u;
        })
      );
    });

    socket.on("typing", ({ from, isTyping: typing }) => {
      if (selectedUser && String(from) === String(selectedUser._id)) {
        setOtherIsTyping(typing);
      }
    });

    socket.on("matchNotification", (data) => {
      if ("Notification" in window && Notification.permission === "granted") {
        const title = "New Match! 🎉";
        const body = data.message || "You have a new match!";
        const notif = new Notification(title, {
          body,
          icon: "/logo192.png",
        });
        notif.onclick = () => {
          window.focus();
          navigate("/matches");
        };
      }
      toast.success("🎉 You have a new match!");
    });

    return () => {
      try {
        socket.off("message");
        socket.off("seen");
        socket.off("presence");
        socket.off("typing");
        socket.off("matchNotification");
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        Object.values(presenceTimeoutRef.current).forEach(clearTimeout);
        presenceTimeoutRef.current = {};
        socket.emit("presence", { userId: me, online: false });
        socket.disconnect();
        socketRef.current = null;
      } catch {}
    };
  }, [selectedUser, navigate]);

  const getMeId = () => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
      const decoded = jwtDecode(token);
      return decoded._id || "";
    } catch (err) {
      console.error("JWT decode error:", err);
      return "";
    }
  };

  const handleSelectUser = async (user) => {
    setMessages([]);
    Object.values(presenceTimeoutRef.current).forEach(clearTimeout);
    presenceTimeoutRef.current = {};
    setSelectedUser(user);
    selectedUserRef.current = user;
    navigate(`/messages/${user._id}`);
    await fetchConversation(user._id);
    markAllAsSeenWith(user._id);
  };

  const goBackToList = useCallback(() => {
    setSelectedUser(null);
    selectedUserRef.current = null;
    setMessages([]);
    navigate("/messages");
  }, [navigate]);

  const fetchConversation = async (userId) => {
    try {
      const me = getMeId();
      if (!me) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/messages/conversation/${userId}`, {
        headers: { "x-user-id": me },
        timeout: 10000,
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please login again");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      convoRef.current?.scrollTo({
        top: convoRef.current.scrollHeight,
        behavior: "auto",
      });
    } catch (err) {
      console.error("Conversation load error", err);
      toast.error("Failed to load conversation: " + (err.message || "unknown"));
      setError(err.message);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    // Emit typing indicator
    if (selectedUser && socketRef.current) {
      if (!isTyping && newText.trim()) {
        setIsTyping(true);
        socketRef.current.emit("typing", { toUserId: selectedUser._id, isTyping: true });
      }
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after user stops for 1 second
      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit("typing", { toUserId: selectedUser._id, isTyping: false });
        }
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !selectedUser) return;
    try {
      const me = getMeId();
      if (!me) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      // Stop typing indicator
      if (socketRef.current) {
        socketRef.current.emit("typing", { toUserId: selectedUser._id, isTyping: false });
      }
      setIsTyping(false);

      const res = await fetch(`${API_URL}/api/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": me,
        },
        body: JSON.stringify({ to: selectedUser._id, text: text.trim() }),
        timeout: 10000,
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please login again");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error(`Send failed: ${res.status}`);
      }

      const m = await res.json();
      const messageTime = m.createdAt || m.timestamp || Date.now();
      setMessages((prev) => [...prev, m]);
      applyUsersUpdate((prev) =>
        prev.map((u) =>
          String(u._id) === String(selectedUser._id)
            ? {
                ...u,
                lastMessage: m.text || text.trim(),
                lastMessageAt: messageTime,
                lastMessageTimestamp: messageTime,
              }
            : u
        )
      );
      setText("");
      convoRef.current?.scrollTo({
        top: convoRef.current.scrollHeight,
        behavior: "auto",
      });
    } catch (err) {
      console.error("Send error", err);
      toast.error("Failed to send message: " + (err.message || "unknown"));
      setError(err.message);
    }
  };

  const markAllAsSeenWith = async (userId) => {
    try {
      const me = getMeId();
      if (!me) return;
      const res = await fetch(`${API_URL}/api/messages/conversation/${userId}`, {
        headers: { "x-user-id": me },
      });
      if (!res.ok) return;
      const msgs = await res.json();
      const unseen = msgs.filter((m) => String(m.from) === String(userId) && !m.seen);
      for (const m of unseen) {
        await fetch(`${API_URL}/api/messages/seen/${m._id}`, {
          method: "PUT",
          headers: { "x-user-id": me },
        });
      }
      await fetchConversation(userId);
    } catch (err) {
      console.error("Mark seen error", err);
    }
  };

  const formatTimestamp = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const timeOptions = { hour: "numeric", minute: "2-digit" };
    const dateOptions = { month: "short", day: "numeric" };

    if (sameDay) return `Today at ${d.toLocaleTimeString([], timeOptions)}`;
    if (isYesterday) return `Yesterday at ${d.toLocaleTimeString([], timeOptions)}`;
    return `${d.toLocaleDateString([], dateOptions)} at ${d.toLocaleTimeString([], timeOptions)}`;
  };

  // Filter users based on search query
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (u) =>
          !searchQuery || 
          (u.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (u.username?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="flex-1 flex flex-col md:pl-[70px] w-full">
        <div className="md:hidden sticky top-0 z-40 bg-white">
          <MobileNavbar />
        </div>
        {selectedUser && (
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
            <button
              onClick={goBackToList}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
            <button
              onClick={() => setShowModal(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <MailPlus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
        <div className="flex flex-1 bg-white messages-container flex-col md:flex-row">
          <Toaster position="top-right" />
          <aside
            className={`w-full md:w-80 border-r border-gray-200 bg-white overflow-y-auto transition-all duration-300 messages-aside flex-shrink-0 ${
              selectedUser ? "hidden md:block" : "block"
            }`}
            aria-label="Conversations list"
          >
            <div className="flex items-center bg-gray-50 border-b border-gray-300 px-4 py-3">
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-full hover:bg-gray-200 transition"
              >
                <ArrowLeft className="h-6 w-6 cursor-pointer text-gray-700" />
              </button>
              <h2 className="flex-1 text-center text-lg font-semibold text-gray-900">
                Chats
              </h2>
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
            <div className="px-4 py-3">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : filteredUsers.length === 0 ? (
                <p className="text-gray-500 text-center">No users found 😕</p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectUser(user)}
                    className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg mx-2 my-1 ${
                      selectedUser?._id === user._id ? "bg-gray-100" : ""
                    }`}
                  >
                    <UserCircle2 className="w-9 h-9 text-gray-400" />
                    <div className="ml-3 flex-1 overflow-hidden">
                      <h3 className="text-[15px] font-semibold truncate text-gray-900">
                        {user.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {user.lastMessage
                          ? user.lastMessage.length > 30
                            ? user.lastMessage.slice(0, 30) + "..."
                            : user.lastMessage
                          : "No messages yet"}
                      </p>
                    </div>
                    <Circle
                      className={`w-2.5 h-2.5 ml-2 ${
                        user.isOnline ? "text-green-500" : "text-gray-300"
                      }`}
                    />
                  </div>
                ))
              )}
            </div>
          </aside>
          <main
            className={`flex-1 flex flex-col bg-white transition-all duration-300 messages-main ${
              selectedUser ? "" : "hidden md:flex"
            }`}
          >
            {selectedUser ? (
              <>
                <header className="flex items-center justify-between p-3 border-b border-b-[#ccc] bg-white/90 backdrop-blur sticky top-0 z-10">
                  <div className="flex items-center">
                    <button
                      onClick={goBackToList}
                      className="mr-2 sm:hidden text-gray-600 font-medium hover:text-gray-800"
                    >
                      <ArrowLeft />
                    </button>
                    <UserCircle2 className="w-8 h-8 text-gray-400" />
                    <div className="ml-3">
                      <h2 className="text-[15px] font-semibold text-gray-900">
                        {selectedUser.name}
                      </h2>
                      <span
                        className={`text-[12px] ${
                          selectedUser.isOnline ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {selectedUser.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </header>
                <div ref={convoRef} className="flex-1 p-3 overflow-y-auto bg-white">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 text-center mt-10">
                      Start chatting with {selectedUser.name} 💬
                    </p>
                  ) : (
                    <>
                      {messages.map((m, idx) => {
                        const meId = String(getMeId());
                        const isMine = String(m.from) === meId;
                        const prev = messages[idx - 1];
                        const next = messages[idx + 1];
                        const sameAsPrev = prev && String(prev.from) === String(m.from);
                        const sameAsNext = next && String(next.from) === String(m.from);
                        const isStartOfGroup = !sameAsPrev;
                        const isEndOfGroup = !sameAsNext;
                        const showDateDivider = (() => {
                          if (!prev) return true;
                          const d1 = new Date(prev.createdAt).toDateString();
                          const d2 = new Date(m.createdAt).toDateString();
                          return d1 !== d2;
                        })();
                        return (
                          <div
                            key={m._id}
                            className={`my-1 max-w-2xl ${isMine ? "ml-auto" : "mr-auto"}`}
                          >
                            {showDateDivider && (
                              <div className="flex items-center justify-center my-2">
                                <div className="text-[11px] text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  {new Date(m.createdAt).toLocaleDateString([], {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                              </div>
                            )}
                            <div
                              className={`flex flex-col ${
                                isMine ? "items-end" : "items-start"
                              } gap-1`}
                            >
                              {isStartOfGroup && (
                                <div className="text-[11px] mb-0.5 text-gray-500">
                                  {isMine ? "You" : selectedUser?.name}
                                </div>
                              )}
                              <div
                                className={`group relative inline-block px-4 py-2 rounded-2xl whitespace-pre-wrap break-words leading-relaxed max-w-[80%] border 
                          ${
                            isMine
                              ? "bg-white text-gray-900 border-blue-200 shadow-sm"
                              : "bg-white text-gray-900 border-gray-200 shadow-sm"
                          }`}
                              >
                                {m.isUnsent ? (
                                  <span
                                    className={`italic ${
                                      isMine ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  >
                                    {isMine ? "You unsent a message" : "Message unsent"}
                                  </span>
                                ) : (
                                  m.text
                                )}
                              </div>
                              {isEndOfGroup && (
                                <div
                                  className={`text-[11px] text-gray-500 block ${
                                    isMine ? "text-right" : "text-left"
                                  }`}
                                >
                                  {formatTimestamp(m.createdAt)}
                                  {isMine ? (m.seen ? " · Seen" : " · Sent") : ""}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {otherIsTyping && (
                        <div className="flex items-center gap-2 p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{selectedUser.name} is typing...</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <footer className="p-3 border-t bg-white flex items-center gap-2 sticky bottom-0">
                  <input
                    value={text}
                    onChange={handleTextChange}
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 transition text-[14px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                  />
                  <button
                    onClick={handleSend}
                    className="px-4 py-2 rounded-full flex items-center gap-1 bg-gray-900 hover:bg-black text-white text-[14px]"
                  >
                    <Send className="w-5 h-5" /> Send
                  </button>
                </footer>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-center px-4">
                <div className="max-w-sm">
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
              </div>
            )}
          </main>
        </div>
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
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-gray-500 text-center">No users available to message.</p>
            ) : (
              <ul className="max-h-64 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <li
                    key={user._id}
                    className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
                    onClick={() => {
                      handleSelectUser(user);
                      setShowModal(false);
                      setSearchQuery("");
                    }}
                  >
                    <UserCircle2 className="w-9 h-9 text-gray-400" />
                    <div className="ml-3 flex-1 overflow-hidden">
                      <span className="font-semibold text-gray-900">{user.name || "Unknown"}</span>
                      <span className="block text-gray-500 text-sm">
                        @{user.username || "unknown"}
                      </span>
                    </div>
                    <Circle
                      className={`w-2.5 h-2.5 ml-2 ${
                        user.isOnline ? "text-green-500" : "text-gray-300"
                      }`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Messages;