// src/pages/Support.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import Layout from "../components/Layout";

function Support() {
  return (
    <Layout>
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-10 font-sans max-w-3xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4 animate-pulse">
            Welcome to the Support Center! ✨
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-6 px-2 sm:px-0">
            We're thrilled to have you here! If you ever get stuck or just want to say hi, our team is ready to help. 
            Don’t worry, you’re in safe hands! 💖
          </p>

          {/* Community & Blog CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/community"
              className="inline-block bg-pink-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold text-base sm:text-lg shadow hover:bg-pink-600 transition transform hover:-translate-y-0.5"
            >
              Join Our Community
            </Link>

            <Link
              to="/blog"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold text-base sm:text-lg shadow hover:opacity-90 transition transform hover:-translate-y-0.5"
            >
              Read Our Blog
            </Link>
          </div>
        </section>

        {/* Support Info */}
        <section className="mt-10 sm:mt-12 bg-white shadow-lg rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">Need Help?</h2>
          <p className="text-gray-700 mb-6 text-sm sm:text-base">
            Browse our FAQ, reach out to our support team, or join the community to get assistance from other users. 
            We’re here to make sure your experience is smooth and fun!
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-800 font-medium text-base sm:text-lg">
            <a href="tel:+9779808370638" className="flex items-center gap-2 hover:text-pink-500 transition">
              <Phone className="w-5 h-5 text-pink-500" />
              +977-9808370638
            </a>
            <a href="mailto:aurameetofficial@gmail.com" className="flex items-center gap-2 hover:text-pink-500 transition break-all">
              <Mail className="w-5 h-5 text-pink-500" />
              aurameetofficial@gmail.com
            </a>
          </div>
        </section>

        {/* Optional Extra Section */}
        <section className="mt-10 sm:mt-12 text-center px-2 sm:px-0">
          <p className="text-gray-500 italic text-sm sm:text-base">
            "Your happiness is our priority. Reach out anytime, we love helping awesome people like you!" 🌟
          </p>
        </section>
      </div>
    </Layout>
  );
}

export default Support;
