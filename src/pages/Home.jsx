import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import ProfileImage from '../assets/user-dp.png';
import PostModel from '../Models/PostModel';

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

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState([]);
  const [error, setError] = useState('');
  const [commentDrafts, setCommentDrafts] = useState({});
  const [pendingLikes, setPendingLikes] = useState({});
  const [pendingComments, setPendingComments] = useState({});
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  });
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    return getSafeUser(localStorage.getItem('user'));
  });
  const commentInputRefs = useRef({});

  const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncAuth = () => {
      setToken(localStorage.getItem('token'));
      setCurrentUser(getSafeUser(localStorage.getItem('user')));
    };
    syncAuth();
    window.addEventListener('authChange', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('authChange', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/posts?page=1&limit=20`, {
        headers: token ? { 'x-user-id': token } : {}
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
          comments: Array.isArray(post.comments) ? post.comments : []
        }))
      );
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

  const handleCommentFocus = (postId) => {
    const input = commentInputRefs.current[postId];
    if (input && typeof input.focus === 'function') {
      input.focus();
    }
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
          'x-user-id': token
        }
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
            likesCount
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
          'x-user-id': token
        },
        body: JSON.stringify({ content: draft })
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
            commentsCount
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
    <div className="bg-gray-200 animate-pulse rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="flex-1">
          <div className="h-3 bg-gray-300 rounded w-3/4 mb-1" />
          <div className="h-2 bg-gray-300 rounded w-1/2" />
        </div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-full mt-3" />
      <div className="h-3 bg-gray-300 rounded w-full mt-1" />
      <div className="h-3 bg-gray-300 rounded w-5/6 mt-1" />
    </div>
  );

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
    const commentLocked = !token || !currentUserId || hasCommented;
    const avatar = post.user?.profileImage || post.avatar || ProfileImage;
    const authorName = post.user?.name || post.author || 'AuraMeet user';
    const timestamp = post.createdAt || post.timestamp;
    const formattedTimestamp = timestamp ? new Date(timestamp).toLocaleString() : '';
    const commentDraft = commentDrafts[postId] || '';
    const likeDisabled = !token || !currentUserId || hasLiked || pendingLikes[postId];

    return (
      <div
        key={postId}
        className="post-card rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
      >
        <div className="flex items-center gap-3 mb-3">
          <img
            src={ProfileImage}
            alt={authorName}
            className="h-12 w-12 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h3 className="text-base font-semibold text-gray-900">{authorName}</h3>
            {formattedTimestamp && (
              <p className="text-xs text-gray-500">{formattedTimestamp}</p>
            )}
          </div>
        </div>
        {post.title && (
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h2>
        )}
        <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">{content}</p>
        {post.content && post.content.split(' ').length > 30 && (
          <button
            onClick={() => toggleReadMore(postId)}
            className="mt-3 text-sm font-semibold text-blue-600"
            type="button"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLike(postId)}
              disabled={likeDisabled}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                likeDisabled
                  ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300'
                  : hasLiked
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:text-blue-700'
              }`}
              aria-label={hasLiked ? 'Liked' : 'Like this post'}
              type="button"
            >
              <Heart
                strokeWidth={1.6}
                className="h-5 w-5"
                fill={hasLiked ? '#2563eb' : 'none'}
              />
            </button>
            <span className="text-sm font-semibold text-gray-600">{likesCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!token || !currentUserId) {
                  navigate('/login');
                  return;
                }
                if (hasCommented) return;
                handleCommentFocus(postId);
              }}
              disabled={hasCommented}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                hasCommented
                  ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:text-blue-600'
              }`}
              aria-label="Write a comment"
              type="button"
            >
              <MessageCircle strokeWidth={1.6} className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-gray-600">{commentsCount}</span>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm">
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
                  ? 'You have already shared your thought'
                  : 'Log in to join the conversation'
                : 'Share something kind'
            }
            disabled={commentLocked || pendingComments[postId]}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            onClick={() => handleCommentSubmit(postId)}
            disabled={
              commentLocked ||
              pendingComments[postId] ||
              !(commentDrafts[postId] || '').trim()
            }
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
          >
            {pendingComments[postId] ? 'Posting' : 'Send'}
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          {Array.isArray(post.comments) && post.comments.length > 0 ? (
            post.comments.slice(-3).map((comment, index) => {
              const commentId = String(comment._id || comment.id || `${postId}-comment-${index}`);
              const commentAuthor =
                (comment.user && (comment.user.name || comment.user.username)) ||
                'AuraMeet user';
              return (
                <div
                  key={commentId}
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left"
                >
                  <p className="text-sm font-semibold text-gray-800">{commentAuthor}</p>
                  <p className="mt-1 text-sm text-gray-600">{comment.content}</p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-400">No comments yet</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="hidden md:flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="max-w-xl rounded-2xl border border-gray-200 bg-white p-10 shadow-lg">
          <h1 className="text-3xl font-semibold text-gray-900">AuraMeet Feed</h1>
          <p className="mt-4 text-base text-gray-600">
            View and share posts directly from your mobile device.
          </p>
          <button
            onClick={() => navigate('/explore')}
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Explore connections
          </button>
        </div>
      </div>

      <PostModel onPostCreated={fetchPosts} />

      <div className="md:hidden block posts-container flex flex-col gap-6 p-4">
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {loading
          ? Array(2)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          : hasContent
          ? posts.map((post) => renderPostCard(post))
          : <p className="text-gray-500 text-center">No posts yet</p>}
      </div>
    </>
  );
}

export default Home;
