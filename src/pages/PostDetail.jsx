import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send, Share2, X } from 'lucide-react';
import { getProfileImage, handleImageError, getOptimizedCloudinaryUrl, isCloudinaryUrl } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';
import { apiFetch, API_ENDPOINTS } from '../utils/apiConfig';
import ProfessionalUrlPreview from '../components/ProfessionalUrlPreview';
import Navbar from '../components/Navbar';

const API_BASE = 'https://backend-vauju-1.onrender.com';

// Helper function to render content with URL previews
const renderContentWithPreviews = (content) => {
  if (!content) return '';
  // Split content by URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  return parts.map((part, index) => {
    // Check if this part is a URL by testing the original regex
    if (part && part.match && part.match(/^https?:\/\/[^\s]+$/)) {
      // This is a URL, render a preview
      return <ProfessionalUrlPreview key={`url-${index}`} url={part} />;
    } else {
      // Regular text
      return <span key={`text-${index}`}>{part || ''}</span>;
    }
  });
};

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch(API_ENDPOINTS.POST_DETAIL(postId), {}, token);
      setPost(data);
    } catch (err) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [postId, token]);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId, fetchPost]);

  const handleLike = async () => {
    if (!token || !currentUser) {
      navigate('/login');
      return;
    }

    if (isLiking) return;

    try {
      setIsLiking(true);
      const response = await apiFetch(
        API_ENDPOINTS.LIKE_POST(postId),
        { method: 'POST' },
        token
      );

      if (response) {
        // Update the post with the new like
        setPost(prev => {
          const alreadyLiked = prev.likes.some(like => 
            like.user && (like.user._id || like.user.id) === (currentUser._id || currentUser.id)
          );

          if (alreadyLiked) {
            // Remove like
            return {
              ...prev,
              likes: prev.likes.filter(like => 
                !(like.user && (like.user._id || like.user.id) === (currentUser._id || currentUser.id))
              )
            };
          } else {
            // Add like
            return {
              ...prev,
              likes: [...prev.likes, { user: currentUser, createdAt: new Date() }]
            };
          }
        });
      }
    } catch (err) {
      console.error('Error liking post:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!token || !currentUser) {
      navigate('/login');
      return;
    }

    if (!commentText.trim() || isCommenting) return;

    try {
      setIsCommenting(true);
      const response = await apiFetch(
        API_ENDPOINTS.COMMENT_POST(postId),
        {
          method: 'POST',
          body: JSON.stringify({ content: commentText.trim() })
        },
        token
      );

      if (response && response.comment) {
        // Add the new comment to the post
        setPost(prev => ({
          ...prev,
          comments: [...prev.comments, response.comment]
        }));
        setCommentText('');
      }
    } catch (err) {
      console.error('Error commenting on post:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/posts/${postId}`;
    const shareTitle = post.title ? `${post.title} - YugalMeet Post` : 'Check out this post on YugalMeet';
    const shareText = post.content ? post.content.substring(0, 100) + '...' : 'Check out this post on YugalMeet';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Sharing failed:', err);
        // Fallback to copying URL
        copyToClipboard(shareUrl);
      }
    } else {
      // Fallback to copying URL
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const isPostLiked = post && post.likes && post.likes.some(like => 
    like.user && (like.user._id || like.user.id) === (currentUser?._id || currentUser?.id)
  );

  // Optimize profile image
  const getOptimizedProfileImage = (user) => {
    const profileImageUrl = getProfileImage(user);
    return isCloudinaryUrl(profileImageUrl) 
      ? getOptimizedCloudinaryUrl(profileImageUrl, { 
          quality: 'auto', 
          fetch_format: 'auto', 
          width: 40, 
          height: 40 
        })
      : profileImageUrl;
  };

  // Optimize post image
  const getOptimizedPostImage = (imageUrl) => {
    return isCloudinaryUrl(imageUrl) 
      ? getOptimizedCloudinaryUrl(imageUrl, { 
          quality: 'auto', 
          fetch_format: 'auto', 
          width: 600,
          height: 400
        })
      : imageUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="ml-3">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="flex justify-between py-4 border-t border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500">Post not found</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Post Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={getOptimizedProfileImage(post.user)}
                  alt={post.user?.name || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => handleImageError(e, post.user?.gender)}
                  loading="lazy"
                />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">
                    {post.user?.name || 'YugalMeet User'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {post.createdAt && new Date(post.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-4">
            {post.title && (
              <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
            )}
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {renderContentWithPreviews(post.content)}
            </p>
          </div>

          {/* Post Image */}
          {post.image && (
            <div className="px-4 pb-4">
              <img
                src={getOptimizedPostImage(post.image)}
                alt="Post"
                className="w-full rounded-lg object-cover max-h-96"
                loading="lazy"
              />
            </div>
          )}

          {/* Post Actions */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${isPostLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'}`}
                  disabled={isLiking}
                >
                  <Heart className={`w-5 h-5 ${isPostLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">
                    {post.likes?.length || 0}
                  </span>
                </button>
                <button
                  onClick={() => document.getElementById('comment-input')?.focus()}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {post.comments?.length || 0}
                  </span>
                </button>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-100">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Comments ({post.comments?.length || 0})
              </h3>
              
              {/* Comments List */}
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment._id} className="flex">
                      <img
                        src={getOptimizedProfileImage(comment.user)}
                        alt={comment.user?.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        onError={(e) => handleImageError(e, comment.user?.gender)}
                        loading="lazy"
                      />
                      <div className="ml-3 flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-gray-700 text-sm">
                            {comment.text || comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                )}
              </div>

              {/* Comment Input */}
              {currentUser ? (
                <form onSubmit={handleComment} className="flex items-center space-x-2">
                  <img
                    src={getOptimizedProfileImage(currentUser)}
                    alt={currentUser?.name || 'You'}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => handleImageError(e, currentUser?.gender)}
                    loading="lazy"
                  />
                  <div className="flex-1 flex items-center bg-gray-100 rounded-full pl-4 pr-2 py-2">
                    <input
                      id="comment-input"
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-sm"
                      disabled={post.comments?.some(c => String(c.user?._id || c.user?.id) === String(currentUser._id || currentUser.id))}
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim() || isCommenting || post.comments?.some(c => String(c.user?._id || c.user?.id) === String(currentUser._id || currentUser.id))}
                      className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default PostDetail;