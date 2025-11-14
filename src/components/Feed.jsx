import React, { useState, useEffect, useCallback } from 'react';
import { getProfileImage, handleImageError } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-vauju-1.onrender.com';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/posts?page=1&limit=20`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to fetch posts');
      }
      const data = await res.json();
      const items = Array.isArray(data?.posts) ? data.posts : [];
      // Ensure each post has the required fields
      const processedPosts = items.map(post => ({
        ...post,
        user: post.user || {},
        content: post.content || '',
        createdAt: post.createdAt || post.timestamp || null,
        likes: Array.isArray(post.likes) ? post.likes : [],
        comments: Array.isArray(post.comments) ? post.comments : []
      }));
      setPosts(processedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle like functionality
  const handleLike = async (postId) => {
    if (!token || !currentUser) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to like post');
      }

      const updatedPost = await res.json();
      
      // Update the posts state with the new like count
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (String(post._id || post.id) === String(postId)) {
            return {
              ...post,
              likes: updatedPost.likes || [...post.likes, currentUser._id],
              likesCount: updatedPost.likesCount || post.likes.length + 1
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error('Error liking post:', err);
      alert(err.message || 'Failed to like post');
    }
  };

  // Handle comment functionality
  const handleComment = (postId) => {
    if (!token || !currentUser) {
      navigate('/login');
      return;
    }
    
    // Navigate to the post detail page for commenting
    navigate(`/posts/${postId}`);
  };

  // Handle share functionality
  const handleShare = async (postId) => {
    const shareUrl = `${window.location.origin}/posts/${postId}`;
    
    try {
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post',
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Post link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing post:', err);
      // Final fallback: show the URL
      alert(`Share this link: ${shareUrl}`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get random gradient for avatar fallback
  const getRandomGradient = (seed) => {
    const gradients = [
      'from-pink-500 to-purple-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500'
    ];
    const index = seed ? Math.abs(seed.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0)) % gradients.length : 0;
    return gradients[index];
  };

  // Check if current user has liked a post
  const hasUserLikedPost = (post) => {
    if (!currentUser) return false;
    return Array.isArray(post.likes) && 
           post.likes.some(like => String(like) === String(currentUser._id));
  };

  if (loading) return (
    <div className="w-full max-w-2xl mx-auto mt-6 space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg border border-gray-100 animate-pulse relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500/10 to-purple-500/10 rounded-full -mt-16 -mr-16"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300"></div>
            <div className="flex-1">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/6"></div>
          </div>
          <div className="flex gap-6">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-700 p-6 rounded-3xl text-center shadow-lg">
        <div className="text-2xl mb-2">⚠️</div>
        <p className="font-medium">{error}</p>
      </div>
    </div>
  );

  if (posts.length === 0) return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 text-center shadow-lg border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-pink-500/10 to-purple-500/10 rounded-full -mt-24 -mr-24"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full -mb-16 -ml-16"></div>
        <div className="text-5xl mb-4">💭</div>
        <p className="text-gray-700 text-xl font-medium">No posts yet</p>
        <p className="text-gray-500 text-sm mt-2">Be the first to share something amazing!</p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6 mx-auto mt-6">
      {posts.map((post) => {
        const postId = post._id || post.id || Math.random().toString(36);
        const authorName = post.user?.name || post.user?.username || 'Anonymous User';
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

        // Check if user has liked this post
        const userHasLiked = hasUserLikedPost(post);

        // Get gradient based on author name
        const gradientClass = getRandomGradient(authorName);
        const initials = getInitials(authorName);

        return (
          <div
            key={postId}
            className="post-card bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500/5 to-purple-500/5 rounded-full -mt-16 -mr-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 rounded-full -mb-12 -ml-12"></div>
            
            <div className="flex items-start gap-4 mb-4">
              {/* Custom avatar with gradient background */}
              <div className="relative flex-shrink-0">
                <img
                  src={getProfileImage(post.user)}
                  alt={authorName}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-md"
                  onError={(e) => {
                    // Hide the image and show initials fallback
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Initials fallback */}
                <div 
                  className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-lg shadow-md hidden`}
                >
                  {initials}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{authorName}</h3>
                    {timestamp && (
                      <p className="text-sm text-gray-500 flex items-center">
                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                        {formatDate(timestamp)}
                      </p>
                    )}
                  </div>
                  
                  {/* Decorative badge */}
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    New
                  </div>
                </div>
                
                {content && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line mt-3 text-sm">
                    {content}
                  </p>
                )}
                
                {/* LHS Action Buttons */}
                <div className="flex items-center gap-4 mt-4">
                  <button 
                    onClick={() => handleLike(postId)}
                    className={`flex items-center gap-2 transition-colors group ${
                      userHasLiked 
                        ? 'text-pink-600' 
                        : 'text-gray-600 hover:text-pink-600'
                    }`}
                    aria-label={userHasLiked ? "Unlike post" : "Like post"}
                  >
                    <div className={`p-2 rounded-full transition-colors ${
                      userHasLiked 
                        ? 'bg-pink-100' 
                        : 'bg-gray-100 group-hover:bg-pink-100'
                    }`}>
                      <svg className="h-5 w-5" fill={userHasLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{likesCount}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleComment(postId)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                    aria-label="Comment on post"
                  >
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{commentsCount}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleShare(postId)}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors group"
                    aria-label="Share post"
                  >
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-green-100 transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Feed;