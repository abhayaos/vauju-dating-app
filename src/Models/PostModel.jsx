import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImage from "../assets/dp.png";
import { SendHorizontal } from "lucide-react";

const API_BASE = "https://backend-vauju-1.onrender.com";

const getSafeUser = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

function PostModel({ onPostCreated }) {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const [currentUser, setCurrentUser] = useState(() => typeof window !== "undefined" ? getSafeUser(localStorage.getItem("user")) : null);
  const [feedback, setFeedback] = useState("");
  const [feedbackTone, setFeedbackTone] = useState("info");

  const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId;
  const canPost = !!currentUser?.canPost;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
      setCurrentUser(getSafeUser(localStorage.getItem("user")));
    };
    syncAuth();
    window.addEventListener("authChange", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(""), 2500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const toneClass = feedbackTone === "success" ? "bg-green-500" : feedbackTone === "error" ? "bg-red-500" : "bg-gray-800";

  const handleFocus = () => {
    if (!token || !currentUserId) return navigate("/login");
    if (!canPost) {
      setFeedbackTone("info");
      setFeedback("Only limited users can create posts.");
    }
  };

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed || !token || !currentUserId || !canPost || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": token
        },
        body: JSON.stringify({ content: trimmed })
      });

      if (!res.ok) throw new Error(await res.text() || "Failed to post");

      await res.json();
      setContent("");
      setFeedbackTone("success");
      setFeedback("Posted!");
      onPostCreated?.();
    } catch (err) {
      setFeedbackTone("error");
      setFeedback(err.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Feedback Toast */}
      {feedback && (
        <div className={`${toneClass} fixed top-3 left-1/2 -translate-x-1/2 text-white px-4 py-2 rounded-full text-xs font-medium shadow-md z-50 animate-pulse`}>
          {feedback}
        </div>
      )}

      {/* Compact Post Composer */}
      <div className="md:hidden flex px-2 pb-2">
        <div className="flex w-full bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          {/* Avatar */}
          <div className="flex-shrink-0 p-2">
            <img
              src={ProfileImage}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border border-gray-300"
            />
          </div>

          {/* Input + Button */}
          <div className="flex-1 flex items-center gap-2 p-1.5 pr-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
              placeholder={canPost ? "What's up?" : "Limited"}
              readOnly={!canPost}
              disabled={loading}
              className="flex-1 border border-[#ccc] resize-none bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '36px' }}
              aria-label="Create post"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim() || !canPost}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-xs font-medium rounded-full transition"
            >
              {loading ? "..." : "Post"}
              <SendHorizontal size={13} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostModel;