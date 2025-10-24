import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo2 from '../assets/logo2.png';
import ProfileImage from '../assets/user-dp.png';

function Home() {
  const navigate = useNavigate();

  const [Posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState([]);

  // Simulate fetching posts
  useEffect(() => {
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          author: 'Abhaya Bikram Shahi',
          avatar: ProfileImage,
          title: 'Introducing our new feature!',
          content:
            'I am the developer of AuraMeet and I am just 15 years old. I have added something cool feature in our app called changing profile picture. You can change your profile picture after 3 to 4 days. I have added in limited users first and then I will add in all users. Stay tuned for more updates!',
          timestamp: '2025-10-24T14:15:00Z'
        },
        {
          id: 2,
          author: 'AuraMeet - Official',
          avatar: Logo2,
          title: 'Introducing our new app feature!',
          content:
            'Hello everyone! We are excited to announce a brand new feature in our AuraMeet app that will enhance your dating experience. Stay tuned for more updates!',
          timestamp: '2025-10-23T18:30:00Z'
        }
      ]);
      setLoading(false);
    }, 2000); // simulate 2s loading
  }, []);

  // Helper to truncate content to 30 words
  const truncateContent = (text, words = 30) => {
    const split = text.split(' ');
    if (split.length <= words) return text;
    return split.slice(0, words).join(' ') + '...';
  };

  const toggleReadMore = (id) => {
    if (expandedPosts.includes(id)) {
      setExpandedPosts(expandedPosts.filter((postId) => postId !== id));
    } else {
      setExpandedPosts([...expandedPosts, id]);
    }
  };

  // Skeleton Loader Component
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

  return (
    <>
      {/* --- Desktop View --- */}
      <div className="hidden md:flex flex-col min-h-screen bg-white justify-start items-center text-center px-4 pt-16 sm:pt-24">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to <span className="text-pink-500">AuraMeet</span> Dating App
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl mb-6 max-w-md">
          Connect with amazing people around the world. Find love, friends, or just new conversations.
        </p>
        <button
          onClick={() => navigate('/explore')}
          className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-pink-600 transition transform hover:-translate-y-1 mb-12 sm:mb-16"
        >
          Explore Now
        </button>

        {/* Desktop Posts */}
        <div className="md:hidden block flex flex-col gap-6 w-full max-w-3xl mb-16">
          {loading
            ? Array(2)
                .fill(0)
                .map((_, index) => <SkeletonCard key={index} />)
            : Posts.map((post) => {
                const isExpanded = expandedPosts.includes(post.id);
                const displayedContent = isExpanded ? post.content : truncateContent(post.content);

                return (
                  <div key={post.id} className="post-card bg-white shadow-md rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{post.author}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(post.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <h2 className="text-lg font-bold mb-2">{post.title}</h2>
                    <p className="text-gray-700">{displayedContent}</p>
                    {post.content.split(' ').length > 30 && (
                      <button
                        onClick={() => toggleReadMore(post.id)}
                        className="text-pink-500 text-sm font-semibold mt-2"
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                      </button>
                    )}
                  </div>
                );
              })}
        </div>
      </div>

      {/* --- Mobile View --- */}
      <div className="md:hidden block posts-container flex flex-col gap-6 p-4">
        {loading
          ? Array(2)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          : Posts.map((post) => {
              const isExpanded = expandedPosts.includes(post.id);
              const displayedContent = isExpanded ? post.content : truncateContent(post.content);

              return (
                <div key={post.id} className="post-card bg-white shadow-md rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{post.author}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(post.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-700">{displayedContent}</p>
                  {post.content.split(' ').length > 30 && (
                    <button
                      onClick={() => toggleReadMore(post.id)}
                      className="text-pink-500 text-sm font-semibold mt-2"
                    >
                      {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </div>
              );
            })}
      </div>
    </>
  );
}

export default Home;
