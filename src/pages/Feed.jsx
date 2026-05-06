import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Heart, MessageCircle, X, Image, Send } from "lucide-react";
import { api } from "../api";

const relativeTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ── Create Post Modal ──────────────────────────────────────────────────────────
function CreatePostModal({ onClose, onSubmit, user }) {
  const [draft, setDraft] = useState("");
  const [draftImage, setDraftImage] = useState("");
  const [postError, setPostError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setSubmitting(true);
    setPostError(null);
    try {
      await onSubmit(draft, draftImage.trim() || null);
      onClose();
    } catch (err) {
      setPostError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold">Create Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition">
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3 px-5 pt-4">
          <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold text-sm flex-shrink-0">
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-semibold text-sm">{user?.fullName}</p>
            <p className="text-xs text-gray-400">Sharing with matches</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="px-5 pb-5 pt-3 space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`What's on your mind, ${user?.fullName?.split(" ")[0]}?`}
            rows={4}
            autoFocus
            className="w-full text-base outline-none resize-none placeholder-gray-400 text-gray-800"
          />
          {draftImage && (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={draftImage}
                alt="preview"
                className="w-full object-cover max-h-48 rounded-xl"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <button
                type="button"
                onClick={() => setDraftImage("")}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
            <Image size={16} className="text-gray-400 flex-shrink-0" />
            <input
              value={draftImage}
              onChange={(e) => setDraftImage(e.target.value)}
              placeholder="Paste image URL (optional)"
              className="flex-1 text-sm outline-none placeholder-gray-400"
            />
          </div>
          {postError && <p className="text-red-500 text-xs">{postError}</p>}
          <button
            type="submit"
            disabled={!draft.trim() || submitting}
            className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl transition text-sm"
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Post Card ──────────────────────────────────────────────────────────────────
function PostCard({ post, currentUser, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const data = await api.getComments(post._id);
        setComments(data.comments || []);
      } catch (_) {}
      setLoadingComments(false);
    }
    setShowComments((p) => !p);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const draft = commentInput;
    setCommentInput("");
    const newComment = await onComment(post._id, draft);
    if (newComment) setComments((p) => [...p, newComment]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold text-sm flex-shrink-0">
          {post.author?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm leading-tight">{post.author?.name}</p>
          <p className="text-gray-400 text-xs">{relativeTime(post.createdAt)}</p>
        </div>
      </div>
      {post.content && (
        <p className="px-4 pb-3 text-gray-800 text-sm leading-relaxed">{post.content}</p>
      )}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="post"
          className="w-full object-cover"
          style={{ maxHeight: "500px", minHeight: "200px" }}
        />
      )}
      {(post.likeCount > 0 || post.commentCount > 0) && (
        <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-400 border-b border-gray-100">
          {post.likeCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                <Heart size={9} className="fill-white text-white" />
              </span>
              {post.likeCount}
            </span>
          )}
          {post.commentCount > 0 && (
            <span className="ml-auto">{post.commentCount} comment{post.commentCount !== 1 ? "s" : ""}</span>
          )}
        </div>
      )}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => onLike(post._id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition hover:bg-gray-50 ${post.likedByMe ? "text-pink-500" : "text-gray-500"}`}
        >
          <Heart size={18} className={post.likedByMe ? "fill-pink-500" : ""} />
          Like
        </button>
        <button
          onClick={toggleComments}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
        >
          <MessageCircle size={18} />
          Comment
        </button>
      </div>
      {showComments && (
        <div className="px-4 py-3 space-y-3 bg-gray-50">
          {loadingComments && <p className="text-gray-400 text-xs">Loading comments...</p>}
          {comments.map((c) => (
            <div key={c._id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold text-xs flex-shrink-0 mt-0.5">
                {c.author?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="bg-white rounded-2xl px-3 py-2 text-sm shadow-sm flex-1">
                <span className="font-semibold text-xs">{c.author?.name}</span>
                <p className="text-gray-700 text-xs mt-0.5">{c.content}</p>
              </div>
            </div>
          ))}
          <form onSubmit={submitComment} className="flex gap-2 items-center">
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 bg-white border rounded-full text-sm outline-none focus:border-pink-400"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="w-8 h-8 rounded-full bg-pink-500 disabled:bg-gray-200 text-white flex items-center justify-center transition"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// ── Feed Page ──────────────────────────────────────────────────────────────────
export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFeed();
      setPosts(data.posts || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeed(); }, []);

  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      )
    );
    try {
      await api.likePost(postId);
    } catch (_) {}
  };

  const handleComment = async (postId, content) => {
    try {
      const data = await api.addComment(postId, content);
      setPosts((prev) =>
        prev.map((p) => p._id === postId ? { ...p, commentCount: p.commentCount + 1 } : p)
      );
      return data.comment;
    } catch (_) {
      return null;
    }
  };

  const handleCreatePost = async (content, imageUrl) => {
    const data = await api.createPost({ content, imageUrl });
    setPosts((prev) => [data.post, ...prev]);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full text-gray-400">Loading feed...</div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-red-500">{error}</p>
      <button onClick={fetchFeed} className="px-4 py-2 bg-black text-white rounded-xl">Retry</button>
    </div>
  );

  return (
    <>
      {showModal && (
        <CreatePostModal
          user={user}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreatePost}
        />
      )}
      <div className="max-w-xl mx-auto p-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold text-sm flex-shrink-0">
              {user?.fullName?.[0]?.toUpperCase() || "U"}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 text-left px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-500 transition"
            >
              What's on your mind?
            </button>
          </div>
          <div className="flex mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-500 hover:bg-gray-50 py-1.5 rounded-xl transition font-medium"
            >
              <Image size={18} className="text-green-500" />
              Photo
            </button>
          </div>
        </div>

        {posts.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <p className="text-4xl mb-3">📭</p>
            <p>No posts yet. Match with people to see their updates!</p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={user}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </>
  );
}
