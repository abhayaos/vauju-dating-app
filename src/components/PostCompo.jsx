import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-vauju-1.onrender.com';

const getSafeUser = () => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

function Post({ onNewPost }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePost = async () => {
    const token = getToken();
    const user = getSafeUser();

    if (!token || !user?._id) {
      navigate('/login');
      return;
    }

    if (!user.canPost) {
      alert('Posting access is limited to selected users.');
      return;
    }

    if (!content.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: content.trim() })
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || 'Failed to create post');
      }

      const newPost = await res.json();
      if (onNewPost) onNewPost(newPost);
      setContent('');
    } catch (err) {
      console.error('Error posting:', err);
      alert(err.message || 'Failed to post. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-xl mx-auto mb-6">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          disabled={loading}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[80px]"
        />
        <button
          onClick={handlePost}
          disabled={loading || !content.trim()}
          className="absolute bottom-2 right-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>

      {loading && (
        <div className="mt-2 text-blue-500 animate-pulse text-sm">
          Uploading your thoughts 💭 please wait...
        </div>
      )}
    </div>
  );
}

export default Post;
