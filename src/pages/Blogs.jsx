import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle, Shield, X } from "lucide-react";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8 text-gray-600">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold">Something went wrong!</h2>
          <p className="mt-2">Please try refreshing the page or contact support.</p>
          <p className="text-sm text-gray-500 mt-2">Error: {this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const blogPosts = [
  {
    id: 1,
    title: "How to Update Profile Info in Aurameet",
    summary: "Learn how to change your profile picture, update your name, and personalize your account.",
    author: "Aurameet Team",
    date: "Oct 21, 2025",
    category: "Guide",
    path: "/blog/how-tp-update-profile-in-aura-meet",
  },
];

function Blogs() {
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Robust search logic with error handling
  const filteredPosts = blogPosts.filter((post) => {
    try {
      if (!search.trim()) return true; // Show all posts if search is empty
      const queryWords = (search || "").toLowerCase().split(/\s+/).filter(Boolean);
      const content = [
        post.title || "",
        post.summary || "",
        post.author || "",
        post.category || "",
      ].join(" ").toLowerCase();
      return queryWords.every((word) => content.includes(word));
    } catch (error) {
      console.error("Search error:", error);
      return true; // Fallback to showing all posts to prevent crash
    }
  });

  // Clear search handler
  const clearSearch = () => setSearch("");

  if (!isMounted) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold mb-4 text-gray-800"
          >
            Welcome to Aurameet Blog! 📚
          </motion.h1>
          <p className="text-gray-600 sm:text-lg mb-6">
            Learn how to use our app, manage your profile, and stay safe with z++ security. 💖
          </p>
          <div className="relative w-full sm:w-1/2 mx-auto mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts by title, topic, or author..."
              value={search || ""}
              onChange={(e) => setSearch(e.target.value || "")}
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition bg-white bg-opacity-90 shadow-sm"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Shield className="w-4 h-4 mr-2 text-green-500" />
            All content moderated with z++ security for a safe, inclusive experience.
          </div>
        </section>

        {/* Blog Posts */}
        <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition duration-300"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.summary}</p>
                </div>
                <div className="flex justify-between items-center text-gray-500 text-xs mb-3">
                  <span>{post.author}</span>
                  <span>{post.date} • {post.category}</span>
                </div>
                <Link
                  to={post.path}
                  className="inline-block text-pink-500 font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center bg-white bg-opacity-90 rounded-lg p-8 shadow-md col-span-full mt-6"
            >
              <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                No posts found for "<span className="text-pink-500">{search}</span>"
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try searching for terms like "safety," "profile," or "guide," or clear the search to see all posts.
              </p>
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition duration-300"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-gray-500 text-sm py-6 text-center mt-12">
          <p>© 2025 Aurameet. All rights reserved.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default Blogs;