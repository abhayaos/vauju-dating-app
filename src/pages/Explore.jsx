import React, { useState } from "react";
import axios from "axios";
import { Loader2, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Dp from "../assets/dp.png";

function RandomGirl() {
  const [girl, setGirl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [male, setMale] = useState(false);
  const [GenderReload, setGenderReload] = useState(false);

  const navigate = useNavigate();

  const fetchRandomGirl = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://backend-vauju-1.onrender.com/api/random-girl");
      setGirl(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white mx-4 mt-5 rounded-2xl shadow-sm border border-gray-200 p-5 text-center">
      <h2 className="font-bold text-lg text-gray-800 mb-3">🎯 Random Girl Finder</h2>
      <p className="text-gray-500 text-sm mb-4">
        Discover someone new instantly 💖
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="animate-spin text-pink-600" size={28} />
          <p className="mt-2 text-gray-500 text-sm">Finding your match...</p>
        </div>
      ) : girl ? (
        <div className="flex flex-col items-center">
          <img
            src={girl.image || Dp}
            alt={girl.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-pink-400"
          />
          <h3 className="mt-3 text-lg font-semibold text-gray-800">{girl.name}</h3>
          <p className="text-sm text-gray-500">
            {girl.age} · {girl.location}
          </p>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => navigate(`/messages/${girl._id}`)}
              className="flex items-center gap-2 border border-pink-500 text-pink-600 py-2 px-4 rounded-lg font-medium hover:bg-pink-50 active:scale-95 transition-all"
            >
              <MessageSquare size={18} /> Message
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={fetchRandomGirl}
          className="bg-gradient-to-r from-pink-600 to-red-500 text-white py-3 px-8 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all"
        >
          Get Random Girl 💃
        </button>
      )}
    </div>
  );
}

export default RandomGirl;
