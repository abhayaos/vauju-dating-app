// src/pages/Community.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Info, CalendarDays, Sparkles, MessagesSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Community() {
  const [activeTab, setActiveTab] = useState("about");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading posts
  useEffect(() => {
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          title: "App Update ✅",
          content: `The app is working properly! 🎉 
Note: The messaging feature is currently under maintenance. We're actively fixing it and it will be back soon. Thanks for your patience! 💖`,
          author: "Admin",
          createdAt: new Date(),
        },
        {
          id: 2,
          title: "Dating Tips 💘",
          content: `Always be yourself 😎 
Honesty and confidence go a long way. Stay authentic and positive — real vibes attract real people.`,
          author: "Admin",
          createdAt: new Date(),
        },
        {
          id: 3,
          title: "Recent Issues 🚧",
          content: `We’re currently improving the Messages page due to backend and frontend bugs. 
Some icons and visuals have been temporarily removed for performance optimization. Thanks for your patience while we make it better! ⚙️`,
          author: "Admin",
          createdAt: new Date(),
        },
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  const formatDateTime = (date) => {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${dateStr} at ${timeStr}`;
  };

  const PostContent = ({ content }) => {
    const words = content.split(" ");
    const [expanded, setExpanded] = useState(false);
    const shouldTruncate = words.length > 30;
    const displayedText = expanded ? content : words.slice(0, 30).join(" ") + (shouldTruncate ? "..." : "");

    return (
      <div className="text-gray-700 mb-4 whitespace-pre-wrap">
        <pre className="font-sans whitespace-pre-wrap break-words text-[15px] leading-relaxed">
          {displayedText}
        </pre>
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-pink-500 font-medium hover:underline mt-1"
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    );
  };

  const events = [
    {
      id: 1,
      title: "Tihar Celebration 2082 ✨",
      date: "November 7 - November 11, 2025",
      description:
        "Celebrate Tihar — the festival of lights, love, and bonding 🪔. Join us online as we spread positivity and joy through #AuraTihar 💖",
      location: "Online — AuraMeet Community",
    },
  ];

  return (
    <Layout>
      <div className="pt-24 px-6 pb-12 max-w-5xl mx-auto font-sans">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AuraMeet Community 💞</h1>
          <p className="text-gray-600 text-lg">
            The heart of Nepal’s first AI-powered dating app — connecting people, stories, and vibes.
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            {[
              { id: "about", label: "About", icon: Info },
              { id: "events", label: "Events", icon: CalendarDays },
              { id: "community", label: "Posts", icon: MessagesSquare },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center px-5 py-2.5 rounded-full text-base font-semibold transition ${
                  activeTab === id
                    ? "bg-pink-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="mr-2" size={20} /> {label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Animated Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center leading-relaxed text-gray-700 px-2 sm:px-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About AuraMeet 💖</h2>
              <p className="text-lg mb-4">
                <span className="font-semibold text-pink-500">AuraMeet</span> is Nepal’s first{" "}
                <b>AI-powered dating & community app</b> — made with love by{" "}
                <b>Abhaya Bikram Shahi</b>. Designed to make real connections meaningful and fun, it blends
                emotions with tech to spark something real. 💫
              </p>

              <div className="flex flex-col items-center gap-3 mt-8">
                <h3 className="text-2xl font-semibold text-gray-800">✨ Why AuraMeet?</h3>
                <ul className="text-gray-700 text-lg space-y-2 text-left">
                  <li>💞 First Nepali Dating App with AI integration</li>
                  <li>🔒 Safe, private, and verified community</li>
                  <li>⚡ Instant chat and connection system (coming soon)</li>
                  <li>🌸 Designed for Gen Z — clean, minimal, aesthetic</li>
                </ul>
              </div>

              <p className="mt-10 text-gray-500 text-sm">
                Built in Nepal 🇳🇵 — for the world. Find your vibe, not just your type.
              </p>
            </motion.div>
          )}

          {activeTab === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
            >
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-white shadow-md hover:shadow-xl transition"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="text-yellow-500" />
                    <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
                  </div>
                  <p className="text-gray-700 mb-3">{event.description}</p>
                  <p className="text-sm text-gray-600">📅 {event.date}</p>
                  <p className="text-sm text-gray-600">📍 {event.location}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "community" && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              {loading ? (
                <div className="text-center text-gray-500 animate-pulse py-10">
                  Loading community posts...
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  No posts yet. Be the first to create one! ✨
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-2xl bg-white shadow border border-gray-100"
                    >
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                      <PostContent content={post.content} />
                      <div className="flex justify-between text-sm text-gray-500 mt-3">
                        <span>By {post.author}</span>
                        <span>{formatDateTime(post.createdAt)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

export default Community;
