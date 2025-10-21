// src/pages/NameChanging.jsx
import React from "react";

function NameChanging() {
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto font-sans">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gray-800 animate-pulse">
          How to Change Your Name & Profile on Aurameet ✨
        </h1>
        <p className="text-gray-600 sm:text-lg mb-6">
          Keep your profile fresh and recognizable by updating your display name and profile picture in Aurameet. Follow this simple guide to personalize your account.
        </p>
      </section>

      {/* Blog Content */}
      <section className="bg-white shadow-lg rounded-xl p-6 sm:p-8 space-y-6">

        <h2 className="text-2xl font-semibold text-gray-800">1. Updating Your Name</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Navigate to the <strong>Edit Profile</strong> section.</li>
          <li>Update your <strong> Name</strong>  fields.</li>
          <li>Click <strong>Save</strong> to apply changes.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800">2. Tips & Tricks</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Use a square image for your profile picture for best display.</li>
          <li>Keep your name recognizable so friends can find you easily.</li>
          <li>If you face any issues, reach out via <strong>Support</strong>:</li>
        </ul>

        {/* Support Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-800 font-medium text-base sm:text-lg mt-2">
          <a href="tel:+9779808370638" className="flex items-center gap-2 hover:text-pink-500 transition">
            📞 +977-9808370638
          </a>
          <a href="mailto:aurameetofficial@gmail.com" className="flex items-center gap-2 hover:text-pink-500 transition break-all">
            📧 aurameetofficial@gmail.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <section className="mt-10 text-center">
        <p className="text-gray-500 italic text-sm sm:text-base">
          Keep your profile updated and enjoy a personalized Aurameet experience! 🌟
        </p>
      </section>
    </div>
  );
}

export default NameChanging;
