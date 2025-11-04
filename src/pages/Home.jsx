import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, CheckCircle2, X, Send, Sparkles, Users, Bell, Calendar, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileImage from '../assets/dp.png';
import PostModel from '../Models/PostModel';
import SwipeCard from '../components/SwipeCard';
import UrlPreview from '../components/UrlPreview';
import { getProfileImage, handleImageError } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'https://backend-vauju-1.onrender.com';

const getSafeUser = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getLikeId = (like) => {
  if (!like) return null;
  if (typeof like === 'string') return like;
  if (typeof like === 'object' && like._id) return like._id;
  if (typeof like === 'object' && like.id) return like.id;
  return null;
};

const getCommentUserId = (comment) => {
  if (!comment) return null;
  const user = comment.user;
  if (!user) return null;
  if (typeof user === 'string') return user;
  if (typeof user === 'object' && user._id) return user._id;
  if (typeof user === 'object' && user.id) return user.id;
  return null;
};

const renderContentWithPreviews = (content) => {
  if (!content) return '';
  
  // Split content by URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  
  return parts.map((part, index) => {
    // Check if this part is a URL by testing the original regex
    if (part && part.match && part.match(/^https?:\/\/[^\s]+$/)) {
      // This is a URL, render a preview
      return <UrlPreview key={`url-${index}`} url={part} />;
    } else {
      // This is regular text, check for hashtags
      const hashtagRegex = /(#\w+)/g;
      const textParts = part ? part.split(hashtagRegex) : [''];
      
      return (textParts || ['']).map((textPart, textIndex) => {
        if (textPart && textPart.match && textPart.match(hashtagRegex)) {
          // This is a hashtag
          return (
            <span 
              key={`hashtag-${index}-${textIndex}`} 
              className="font-bold text-pink-600 cursor-pointer hover:underline"
              onClick={() => alert(`Showing posts with hashtag: ${textPart}`)}
            >
              {textPart}
            </span>
          );
        } else {
          // Regular text
          return <span key={`text-${index}-${textIndex}`}>{textPart || ''}</span>;
        }
      });
    }
  });
};

function Home() {
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState({
    posts: 0,
    matches: 0,
    coins: 250
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeMode, setSwipeMode] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState([]);
  const [pendingLikes, setPendingLikes] = useState({});
  const [pendingComments, setPendingComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [openCommentPopup, setOpenCommentPopup] = useState(null);
  const commentInputRefs = useRef({});

  const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/posts?page=1&limit=20`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to load posts');
      }
      const data = await res.json();
      const list = Array.isArray(data?.posts) ? data.posts : [];
      setPosts(
        list.map((post) => ({
          ...post,
          likes: Array.isArray(post.likes) ? post.likes : [],
          comments: Array.isArray(post.comments) ? post.comments : [],
        }))
      );
      // Update stats
      setStats(prev => ({ ...prev, posts: list.length }));
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const fetchProfiles = useCallback(async () => {
    try {
      if (!token) {
        return;
      }

      const response = await fetch(
        'https://backend-vauju-1.onrender.com/api/matches',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profiles: ${response.status}`);
      }

      const data = await response.json();
      const visibleProfiles = Array.isArray(data)
        ? data.filter((item) => item && item._id && item.name)
        : [];

      setProfiles(visibleProfiles);
      // Update stats
      setStats(prev => ({ ...prev, matches: visibleProfiles.length }));
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSwipeLeft = async (profileId) => {
    // Pass action
    setCurrentIndex(prev => prev + 1);
    try {
      if (!token) return;

      await fetch(
        `https://backend-vauju-1.onrender.com/api/matches/${profileId}/pass`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error('Pass error:', err);
    }
  };

  const handleSwipeRight = async (profileId) => {
    // Like action
    setCurrentIndex(prev => prev + 1);
    try {
      if (!token) return;

      await fetch(
        `https://backend-vauju-1.onrender.com/api/matches/${profileId}/like`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const truncateContent = (text, words = 30) => {
    if (!text) return '';
    const split = text.split(' ');
    if (split.length <= words) return text;
    return `${split.slice(0, words).join(' ')}...`;
  };

  const toggleReadMore = (id) => {
    setExpandedPosts((prev) =>
      prev.includes(id) ? prev.filter((postId) => postId !== id) : [...prev, id]
    );
  };

  const handleLike = async (rawId) => {
    const postId = String(rawId);
    if (!token || !currentUserId) {
      navigate('/login');
      return;
    }
    const target = posts.find((post) => String(post._id || post.id) === postId);
    if (!target) return;
    const hasLiked =
      Array.isArray(target.likes) &&
      target.likes.some((like) => String(getLikeId(like)) === String(currentUserId));
    if (hasLiked) return;
    if (pendingLikes[postId]) return;
    try {
      setPendingLikes((prev) => ({ ...prev, [postId]: true }));
      const res = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Unable to like this post');
      }
      const data = await res.json();
      const likesCount =
        typeof data?.likesCount === 'number'
          ? data.likesCount
          : (target.likes ? target.likes.length : 0) + 1;
      setPosts((prev) =>
        prev.map((post) => {
          if (String(post._id || post.id) !== postId) {
            return post;
          }
          return {
            ...post,
            likes: [...post.likes, currentUserId],
            likesCount,
          };
        })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingLikes((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    }
  };

  const handleCommentDraftChange = (postId, value) => {
    setCommentDrafts((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (rawId) => {
    const postId = String(rawId);
    if (!token || !currentUserId) {
      navigate('/login');
      return;
    }
    const draft = (commentDrafts[postId] || '').trim();
    if (!draft) return;
    const target = posts.find((post) => String(post._id || post.id) === postId);
    if (!target) return;
    const hasCommented =
      Array.isArray(target.comments) &&
      target.comments.some(
        (comment) => String(getCommentUserId(comment)) === String(currentUserId)
      );
    if (hasCommented) return;
    if (pendingComments[postId]) return;
    try {
      setPendingComments((prev) => ({ ...prev, [postId]: true }));
      const res = await fetch(`${API_BASE}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: draft }),
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Unable to add comment');
      }
      const data = await res.json();
      const commentsCount =
        typeof data?.commentsCount === 'number'
          ? data.commentsCount
          : (target.comments ? target.comments.length : 0) + 1;
      setPosts((prev) =>
        prev.map((post) => {
          if (String(post._id || post.id) !== postId) {
            return post;
          }
          const nextComments = data?.comment
            ? [...post.comments, data.comment]
            : [...post.comments];
          return {
            ...post,
            comments: nextComments,
            commentsCount,
          };
        })
      );
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingComments((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    }
  };

  const hasContent = Array.isArray(posts) && posts.length > 0;

  const SkeletonCard = () => (
    <div className="bg-white animate-pulse rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-4/6 mb-4" />
      <div className="flex gap-4 mt-3">
        <div className="h-9 w-9 bg-gray-200 rounded-full" />
        <div className="h-9 w-9 bg-gray-200 rounded-full" />
      </div>
    </div>
  );

  const CommentPopup = ({ post, onClose }) => {
    const postId = String(post._id || post.id);
    const commentDraft = commentDrafts[postId] || '';
    const hasCommented =
      currentUserId &&
      Array.isArray(post.comments) &&
      post.comments.some(
        (comment) => String(getCommentUserId(comment)) === String(currentUserId)
      );
    const commentLocked = !token || !currentUserId || hasCommented;

    useEffect(() => {
      if (!commentLocked && commentInputRefs.current[postId]) {
        commentInputRefs.current[postId].focus();
      }
    }, [postId, commentLocked]);

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        role="dialog"
        aria-labelledby="comments-title"
      >
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 id="comments-title" className="text-lg font-semibold text-gray-900">
              Comments
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close comments"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {Array.isArray(post.comments) && post.comments.length > 0 ? (
              post.comments.map((comment, index) => {
                const commentId = String(comment._id || comment.id || `${postId}-comment-${index}`);
                const commentAuthor =
                  (comment.user && (comment.user.name || comment.user.username)) ||
                  'YugalMeet User';
                const isCommentVerified = comment.user?.verified || false;
                return (
                  <div
                    key={commentId}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 mb-2"
                  >
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-gray-800">{commentAuthor}</p>
                      {isCommentVerified && (
                        <CheckCircle2
                          className="h-3.5 w-3.5 text-blue-500"
                          aria-label="Verified Commenter"
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No comments yet.</p>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <input
                ref={(el) => {
                  if (el) {
                    commentInputRefs.current[postId] = el;
                  } else {
                    delete commentInputRefs.current[postId];
                  }
                }}
                type="text"
                value={commentDraft}
                onChange={(e) => handleCommentDraftChange(postId, e.target.value)}
                placeholder={
                  commentLocked
                    ? hasCommented
                      ? 'You have already commented'
                      : 'Log in to comment'
                    : 'Add a comment...'
                }
                disabled={commentLocked || pendingComments[postId]}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                aria-label="Comment input"
              />
              <button
                onClick={() => handleCommentSubmit(postId)}
                disabled={
                  commentLocked ||
                  pendingComments[postId] ||
                  !(commentDrafts[postId] || '').trim()
                }
                className="inline-flex items-center justify-center rounded-full bg-pink-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                aria-label="Submit comment"
              >
                {pendingComments[postId] ? 'Sending...' : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPostCard = (post) => {
    const postId = String(post._id || post.id);
    const isExpanded = expandedPosts.includes(postId);
    const content = isExpanded ? post.content : truncateContent(post.content);
    const likesCount =
      typeof post.likesCount === 'number'
        ? post.likesCount
        : Array.isArray(post.likes)
        ? post.likes.length
        : 0;
    const commentsCount =
      typeof post.commentsCount === 'number'
        ? post.commentsCount
        : Array.isArray(post.comments)
        ? post.comments.length
        : 0;
    const hasLiked =
      currentUserId &&
      Array.isArray(post.likes) &&
      post.likes.some((like) => String(getLikeId(like)) === String(currentUserId));
    const hasCommented =
      currentUserId &&
      Array.isArray(post.comments) &&
      post.comments.some(
        (comment) => String(getCommentUserId(comment)) === String(currentUserId)
      );
    const likeDisabled = !token || !currentUserId || hasLiked || pendingLikes[postId];

    return (
      <div
        key={postId}
        className="post-card bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition-shadow hover:shadow-md"
      >
        <div className="flex items-center gap-3 mb-4">
          <img
            src={getProfileImage(post.user)}
            alt={post.user?.name || post.author || 'YugalMeet User'}
            className="h-12 w-12 rounded-full object-cover border border-gray-200"
            onError={(e) => handleImageError(e, post.user?.gender)}
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h3 className="text-base font-semibold text-gray-900">
                {post.user?.name || post.author || 'YugalMeet User'}
              </h3>
              {post.user?.verified && (
                <CheckCircle2
                  className="h-4 w-4 text-blue-500"
                  aria-label="Verified User"
                />
              )}
            </div>
            {post.createdAt && (
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            )}
          </div>
        </div>
        {post.title && (
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h2>
        )}
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
          {renderContentWithPreviews(content)}
        </p>
        {post.content && post.content.split(' ').length > 30 && (
          <button
            onClick={() => toggleReadMore(postId)}
            className="mt-2 text-sm font-medium text-pink-600 hover:text-pink-700 transition"
            type="button"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLike(postId)}
              disabled={likeDisabled}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                likeDisabled
                  ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
                  : hasLiked
                  ? 'border-pink-200 bg-pink-50 text-pink-600'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-pink-300 hover:text-pink-600'
              }`}
              aria-label={hasLiked ? 'Liked' : 'Like this post'}
              type="button"
            >
              <Heart
                strokeWidth={1.8}
                className="h-5 w-5"
                fill={hasLiked ? '#ec4899' : 'none'}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">{likesCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenCommentPopup(postId)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-pink-200 hover:text-pink-600 transition"
              aria-label="View comments"
              type="button"
            >
              <MessageCircle strokeWidth={1.8} className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-gray-700">{commentsCount}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout - Professional Feed */}
      <div className="hidden md:block">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4 md:ml-20 ml-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-7 w-7 text-pink-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="text-pink-600">Yugal</span>Meet
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSwipeMode(!swipeMode)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition font-medium"
                >
                  {swipeMode ? 'Feed Mode' : 'Swipe Mode'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm font-medium">Notifications</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-3 md:ml-20 ml-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
              
                
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span className="text-sm font-medium text-gray-600">Matches</span>
                  <span className="text-sm font-bold text-gray-900">{stats.matches}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600">Coins</span>
                  <span className="text-sm font-bold text-gray-900">{stats.coins}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Welcome back, {currentUser?.name || 'User'}!
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8 md:ml-20 ml-0">
          {swipeMode ? (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Discover Matches</h2>
              <div className="relative w-full max-w-sm h-[500px]">
                {profiles.length > 0 && currentIndex < profiles.length ? (
                  <SwipeCard 
                    profile={profiles[currentIndex]} 
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                  />
                ) : (
                  <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200 w-full h-full flex flex-col items-center justify-center">
                    <p className="text-gray-500 text-lg mb-4">
                      {profiles.length === 0 
                        ? "No profiles available at the moment." 
                        : "You've viewed all profiles!"}
                    </p>
                    <button 
                      onClick={fetchProfiles}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition font-medium"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-6 mt-8">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => profiles[currentIndex] && handleSwipeLeft(profiles[currentIndex]._id)}
                  className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition"
                >
                  <X className="text-white" size={24} />
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => profiles[currentIndex] && handleSwipeRight(profiles[currentIndex]._id)}
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:bg-green-600 transition"
                >
                  <Heart className="text-white" size={24} fill="white" />
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              <PostModel onPostCreated={fetchPosts} />
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed Column */}
                <div className="lg:col-span-2 space-y-6">
                  {loading ? (
                    Array(3)
                      .fill(0)
                      .map((_, index) => <SkeletonCard key={index} />)
                  ) : hasContent ? (
                    <>
                      {posts.map((post) => renderPostCard(post))}
                      {posts.map((post) => {
                        const postId = String(post._id || post.id);
                        return openCommentPopup === postId ? (
                          <CommentPopup
                            key={`comment-${postId}`}
                            post={post}
                            onClose={() => setOpenCommentPopup(null)}
                          />
                        ) : null;
                      })}
                    </>
                  ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
                      <p className="text-gray-500 text-lg mb-6">
                        No posts yet. Be the first to share!
                      </p>
                      <PostModel onPostCreated={fetchPosts} />
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* User Profile Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-pink-600" />
                      Your Profile
                    </h3>
                    {currentUser ? (
                      <div className="flex items-center gap-3 mb-4">
            <img
              src={getProfileImage(currentUser)}
              alt={currentUser.name}
              className="h-14 w-14 rounded-full object-cover border-2 border-pink-200 flex-shrink-0"
              onError={(e) => handleImageError(e, currentUser.gender)}
            />
                        <div>
                          <p className="font-semibold text-gray-900">{currentUser.name}</p>
                          <p className="text-sm text-gray-500">{currentUser.email}</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition font-medium"
                      >
                        Sign In to Connect
                      </button>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate('/editprofile')}
                        className="w-full text-center text-sm text-pink-600 font-medium hover:text-pink-700"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate('/matches')}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                      >
                        <Sparkles className="h-5 w-5 text-pink-600" />
                        <span className="font-medium text-gray-800">Explore Matches</span>
                      </button>
                      <button
                        onClick={() => navigate('/messages')}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                      >
                        <MessageCircle className="h-5 w-5 text-pink-600" />
                        <span className="font-medium text-gray-800">Messages</span>
                      </button>
                      <button
                        onClick={() => navigate('/explore')}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                      >
                        <MapPin className="h-5 w-5 text-pink-600" />
                        <span className="font-medium text-gray-800">Explore People</span>
                      </button>
                      <button
                        onClick={() => navigate('/community')}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                      >
                        <Users className="h-5 w-5 text-pink-600" />
                        <span className="font-medium text-gray-800">Community</span>
                      </button>
                    </div>
                  </div>

                  {/* Yugal Coins Section */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-sm border border-yellow-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          YC
                        </div>
                        Yugal Coins
                      </h3>
                      <span className="text-2xl font-bold text-yellow-600">{stats.coins}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Use coins to boost posts, send gifts, or unlock premium features.
                    </p>
                    <button 
                      onClick={() => navigate('/buy-coins')}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 rounded-xl hover:from-yellow-600 hover:to-orange-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Get More Coins - रु 250
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Feed Section */}
      <div className="md:hidden flex-1 p-4 bg-gray-50">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Feed</h2>
          <button 
            onClick={() => setSwipeMode(!swipeMode)}
            className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm rounded-lg hover:from-pink-600 hover:to-purple-700 transition font-medium"
          >
            {swipeMode ? 'Feed' : 'Swipe'}
          </button>
        </div>
        
        {swipeMode ? (
          <div className="flex flex-col items-center">
            <div className="relative w-full h-[500px]">
              {profiles.length > 0 && currentIndex < profiles.length ? (
                <SwipeCard 
                  profile={profiles[currentIndex]} 
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
              ) : (
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200 w-full h-full flex flex-col items-center justify-center">
                  <p className="text-gray-500 text-lg mb-4">
                    {profiles.length === 0 
                      ? "No profiles available at the moment." 
                      : "You've viewed all profiles!"}
                  </p>
                  <button 
                    onClick={fetchProfiles}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition font-medium"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex gap-6 mt-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => profiles[currentIndex] && handleSwipeLeft(profiles[currentIndex]._id)}
                className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition"
              >
                <X className="text-white" size={20} />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => profiles[currentIndex] && handleSwipeRight(profiles[currentIndex]._id)}
                className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:bg-green-600 transition"
              >
                <Heart className="text-white" size={20} fill="white" />
              </motion.button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <PostModel onPostCreated={fetchPosts} />
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-xl text-center">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-4">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, index) => <SkeletonCard key={index} />)
              ) : hasContent ? (
                posts.map((post) => renderPostCard(post))
              ) : (
                <p className="text-gray-500 text-center text-sm py-8">
                  No posts available. Create one to get started!
                </p>
              )}
            </div>
            
            {/* Yugal Coins Section - Mobile */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 shadow-sm border border-yellow-200 mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    YC
                  </div>
                  <span className="text-sm">Yugal Coins</span>
                </h3>
                <span className="text-lg font-bold text-yellow-600">{stats.coins}</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Use coins to boost posts, send gifts, or unlock premium features.
              </p>
              <button 
                onClick={() => navigate('/buy-coins')}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition font-medium flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="h-3 w-3" />
                Get More Coins - रु 250
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;