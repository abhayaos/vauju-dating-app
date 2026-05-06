import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, HeartCrack } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 px-4">

      {/* 💔 Icon */}
      <div className="text-gray-500 mb-4">
        <HeartCrack size={70} />
      </div>

      {/* Title */}
      <h1 className="text-6xl font-extrabold tracking-tight">404</h1>

      {/* Message */}
      <p className="text-gray-500 mt-3 text-center max-w-md">
      xyaaa mula kk dabxa hoittt galat page ma aayeu!!
        <br />
        fathafat home ma daba 
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 cursor-pointer flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl shadow-md transition-all"
      >
        <Home size={18} />
        Back to Home
      </button>

    </div>
  );
}

export default NotFound;