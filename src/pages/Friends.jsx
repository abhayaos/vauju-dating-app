import React from "react";
import { Sparkles } from "lucide-react";

function Friends() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-purple-100 rounded-full">
          <Sparkles size={32} className="text-purple-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Friends</h1>
        <p className="text-lg text-gray-600 mb-2">Coming Soon</p>
        <p className="text-sm text-gray-500 max-w-sm">We're working on bringing you an amazing friends feature. Stay tuned!</p>
      </div>
    </div>
  );
}

export default Friends;
