// src/pages/Community.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { BookAIcon, Info } from "lucide-react";
import { Link } from "react-router-dom";

function Community() {
  const [activeTab, setActiveTab] = useState("community");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated API call for posts
  useEffect(() => {
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          title: "App Update ✅",
          content: `The app is working properly! 🎉
Note: The messaging feature is currently under maintenance. We're actively fixing it and it will be back soon.
Thanks for your patience! 💖`,
          author: "Admin",
          createdAt: new Date(),
        },
        {
          id: 2,
          title: "Dating Tips 💘",
          content: "Always be yourself 😎",
          author: "Admin",
          createdAt: new Date(),
        },
        {
          id: 3,
          title: "Recent Issues!",
          content: `We are currently working on the Messages page. Due to certain backend and frontend issues, some professional icons have been temporarily removed from Message.jsx.

Please ensure you review our Terms and Conditions at vauju.vercel.app.
If you are accessing the site via mobile, you can find it by tapping the three-line menu icon located at the top right corner beside the logo.`,
          author: "Admin",
          createdAt: new Date(),
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Format date and time
  const formatDateTime = (date) => {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const timeStr = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} at ${timeStr}`;
  };

  // Read more / less component
  const PostContent = ({ content }) => {
    const words = content.split(" ");
    const [expanded, setExpanded] = useState(false);
    const shouldTruncate = words.length > 30;

    const displayedText = expanded
      ? content
      : words.slice(0, 30).join(" ") + (shouldTruncate ? "..." : "");

    return (
      <div className="text-gray-700 mb-4 whitespace-pre-wrap">
        <pre className="font-sans whitespace-pre-wrap break-words text-gray-700 text-[15px] leading-relaxed">
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

  return (
    <Layout>
      <div className="pt-24 px-6 pb-10 max-w-5xl mx-auto font-sans">
        {/* Hero Section */}
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Community</h1>
          <p className="text-gray-600 text-lg mb-6">
            Connect with others, share tips, ask questions, and join
            discussions with our community.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/hall-of-fame"
              className="inline-flex items-center bg-pink-500 text-white px-5 py-3 rounded-full font-semibold text-lg shadow hover:bg-pink-600 transition transform hover:-translate-y-1"
            >
              <BookAIcon className="mr-2" size={20} /> Bug Bounters
            </Link>

            <button
              onClick={() => setActiveTab("about")}
              className={`inline-flex items-center px-5 py-3 rounded-full font-semibold text-lg shadow transition ${
                activeTab === "about"
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Info className="mr-2" size={20} /> About
            </button>
          </div>
        </section>

        {/* Tabs Content */}
        <section>
          {activeTab === "about" ? (
            <div className="text-center text-gray-700 bg-white rounded-lg p-8 shadow-md max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                About AuraMeet 💖
              </h2>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                Welcome to{" "}
                <span className="font-semibold text-pink-500">AuraMeet</span> — 
                Nepal’s first dating platform built to connect hearts with trust and tech.  
                Created with passion by <b>Abhaya Bikram Shahi</b>.
              </p>

              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                The AuraMeet community is your go-to space for sharing updates, 
                ideas, and feedback. Whether you’re looking for dating tips, 
                app news, or just chill convos — this is where it happens. 💬
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mt-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  🎯 Our Campaigns
                </h3>
                <p className="text-gray-700 text-lg">
                  💘 For <b>Males:</b>{" "}
                  <span className="text-pink-500 font-semibold">
                    "Vauju Khoj Abhiyan"
                  </span>
                  <br />
                  💞 For <b>Females:</b>{" "}
                  <span className="text-pink-500 font-semibold">
                    "Vinaju Khoj Abhiyan"
                  </span>
                </p>
              </div>

              <p className="text-gray-500 text-sm mt-6">
                Join the movement. Connect, vibe, and find your match — Aura style. 💫
              </p>
            </div>
          ) : loading ? (
            <div className="text-center text-gray-500 animate-pulse py-10">
              Loading community posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No posts yet. Be the first to create one! ✨
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {post.title}
                  </h2>
                  <PostContent content={post.content} />
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>By {post.author}</span>
                    <span>Uploaded: {formatDateTime(post.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default Community;
