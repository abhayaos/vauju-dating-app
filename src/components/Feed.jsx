import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-vauju-1.onrender.com';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncToken = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('authChange', syncToken);
    window.addEventListener('storage', syncToken);
    return () => {
      window.removeEventListener('authChange', syncToken);
      window.removeEventListener('storage', syncToken);
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
        throw new Error(message || 'Failed to fetch posts');
      }
      const data = await res.json();
      const items = Array.isArray(data?.posts) ? data.posts : [];
      setPosts(items);
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

  if (loading) return <p className="text-center mt-4">Loading posts...</p>;

  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  if (posts.length === 0) return <p className="text-center text-gray-500 mt-4">No posts yet</p>;

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4 mx-auto mt-6">
      {posts.map((post) => {
        const postId = post._id || post.id;
        const authorName = post.user?.name || post.user?.username || post.user || 'Anonymous';
        const content = post.content || '';
        const timestamp = post.createdAt || post.timestamp;
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

        return (
          <div
            key={postId}
            className="bg-white p-4 rounded shadow hover:bg-gray-50"
          >
            <h3 className="font-bold">{authorName}</h3>
            <p className="mt-1 whitespace-pre-line">{content}</p>
            {timestamp && (
              <small className="block text-gray-400 text-sm mt-2">
                {new Date(timestamp).toLocaleString()}
              </small>
            )}
            <div className="flex gap-4 text-sm text-gray-500 mt-3">
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
              <span>{commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Feed;
