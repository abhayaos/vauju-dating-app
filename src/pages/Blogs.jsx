// src/pages/Blogs.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

// Only our app's blog posts
const blogPosts = [
  {
    id: 1,
    title: "How to Update Profile Info in Aurameet",
    summary: "Learn how to change your profile picture, update your name, and personalize your account.",
    author: "Aurameet Team",
    date: "Oct 21, 2025",
    category: "Guide",
    path: "/blog/how-tp-update-profile-in-aura-meet"
  },
];

function Blogs() {
  const [search, setSearch] = useState("");

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto font-sans">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gray-800 animate-pulse">
          Welcome to Aurameet Blog! 📚
        </h1>
        <p className="text-gray-600 sm:text-lg mb-6">
          Learn how to use our app, manage your profile, and get the most out of Aurameet.
        </p>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition mb-4"
        />
      </section>

      {/* Blog Posts */}
      <section className="grid gap-6 sm:grid-cols-1">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h2>
              <p className="text-gray-600 text-sm mb-3">{post.summary}</p>
            </div>
            <div className="flex justify-between items-center text-gray-500 text-xs">
              <span>{post.author}</span>
              <span>{post.date}</span>
            </div>
            <Link
              to={`/blogs/${post.path}`}
              className="mt-3 inline-block text-pink-500 font-semibold hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No posts found for "{search}"
          </p>
        )}
      </section>
    </div>
  );
}

export default Blogs;
