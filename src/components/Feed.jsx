import React, { useState, useEffect } from 'react';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading posts...</p>;

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4 mx-auto mt-6">
      {/* Display posts only, Post creation box removed */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id || post.id}
            className="bg-white p-4 rounded shadow hover:bg-gray-50"
          >
            <h3 className="font-bold">{post.user || 'Anonymous'}</h3>
            <p className="mt-1">{post.content}</p>
            <small className="text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;
