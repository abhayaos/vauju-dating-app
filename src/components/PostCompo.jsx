import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Post({ onNewPost }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePost = async () => {
    const userInfoStr = localStorage.getItem('userInfo');

    if (!userInfoStr) {
      console.error('No user info found, redirecting to login...');
      navigate('/login'); // Redirect user to login
      return;
    }

    let token;
    try {
      token = JSON.parse(userInfoStr).token;
    } catch (err) {
      console.error('Failed to parse user info:', err);
      navigate('/login');
      return;
    }

    if (!token) {
      console.error('No token found, user is not authenticated');
      navigate('/login');
      return;
    }

    if (!content.trim()) return; // Don't post empty content

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || 'Failed to create post');
      }

      const newPost = await res.json();
      if (onNewPost) onNewPost(newPost); // Notify parent
      setContent('');
    } catch (err) {
      console.error('Error posting:', err);
      alert('Failed to post. Make sure you are logged in.');
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
