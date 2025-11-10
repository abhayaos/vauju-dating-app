import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImage from "../assets/dp.png";
import { SendHorizontal } from "lucide-react";
import { getProfileImage, handleImageError } from "../utils/imageUtils";
import { useAuth } from "../context/AuthContext";

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
  const { token, user: currentUser } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackTone, setFeedbackTone] = useState("info");
  const textareaRef = useRef(null);

  const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId;
  const canPost = !!currentUser?.canPost;

  // ============================================
  // AUTO-RESIZE TEXTAREA - Adjusts height based on content
  // ============================================
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [content]);

  // ============================================
  // SYNC AUTH STATE - Managed by AuthContext
  // ============================================
  useEffect(() => {
    // No longer needed - auth state is managed by AuthContext
  }, []);

  // ============================================
  // AUTO-HIDE FEEDBACK - Toast disappears after 3 seconds
  // ============================================
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(""), 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const toneClass = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
  }[feedbackTone];

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
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content: trimmed }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to post");
      }

      await res.json();
      setContent("");
      setFeedbackTone("success");
      setFeedback("Posted successfully!");
      onPostCreated?.();
    } catch (err) {
      setFeedbackTone("error");
      setFeedback(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* ============================================ */}
      {/* FEEDBACK TOAST - Shows success/error/info messages */}
      {/* ============================================ */}
      {feedback && (
        <div
          className={`${toneClass} fixed top-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-300`}
        >
          {feedback}
        </div>
      )}

      {/* ============================================ */}
      {/* MOBILE-ONLY POST COMPOSER (Hidden on PC) */}
      {/* ============================================ */}
      <div className="px-3 pb-3  mt-5">
        <div className="flex w-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          {/* ========== AVATAR SECTION ========== */}
          <div className="flex-shrink-0 p-3">
            <div className="relative">
              <img
                src={currentUser ? getProfileImage(currentUser) : ProfileImage}
                alt="Your profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                onError={(e) => handleImageError(e, currentUser?.gender)}
              />
              {!canPost && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm4-6a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* ========== INPUT & BUTTON SECTION ========== */}
          <div className="flex-1 flex flex-col min-w-0">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder={canPost ? "What's on your mind?" : "Posting is limited"}
              readOnly={!canPost}
              disabled={loading}
              className="flex-1 w-full px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent resize-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:text-gray-400 scrollbar-hide"
              style={{
                minHeight: content.length === 0 ? "40px" : "48px",
                maxHeight: "200px",
                overflow: "hidden",
                scrollbarWidth: "none",
                msOverflowStyle: "none"
              }}
              aria-label="Create a post"
            />
            {/* ========== HIDE SCROLLBAR ========== */}
            <style>{`
              textarea::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div className="flex items-center justify-end px-4 py-2 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={loading || !content.trim() || !canPost}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  loading || !content.trim() || !canPost
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm hover:shadow-md"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Posting...
                  </span>
                ) : (
                  <>
                    Post
                    <SendHorizontal size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* DESKTOP VERSION IS REMOVED — HIDDEN ON PC */}
      {/* ============================================ */}
    </>
  );
}

export default PostModel;