import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Heart, Users } from "lucide-react";
import { api } from "../api";

function Avatar({ src, name, size = "md" }) {
  const dim = size === "lg" ? "w-full h-40" : "w-full h-36";
  if (src) return <img src={src} alt={name} className={`${dim} object-cover`} />;
  return (
    <div className={`${dim} bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-3xl font-bold`}>
      {name?.[0]?.toUpperCase()}
    </div>
  );
}

export default function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("matches"); // "matches" | "likes"

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [matchData, likeData] = await Promise.all([
        api.getMatches(),
        api.getLikes(),
      ]);
      setMatches(matchData.matches || []);
      setLikes(likeData.likes || []);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Connections</h1>
        <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setTab("matches")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === "matches" ? "bg-white shadow text-pink-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users size={15} />
            Matches
            {matches.length > 0 && (
              <span className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {matches.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("likes")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === "likes" ? "bg-white shadow text-pink-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Heart size={15} />
            Liked
            {likes.length > 0 && (
              <span className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {likes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Matches tab */}
      {tab === "matches" && (
        <>
          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400 text-center">
              <p className="text-5xl">💔</p>
              <p className="text-lg font-medium">No matches yet</p>
              <p className="text-sm">Keep swiping to find your match!</p>
              <button
                onClick={() => navigate("/")}
                className="mt-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl text-sm font-medium"
              >
                Start Swiping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {matches.map((match) => (
                <div
                  key={match._id}
                  onClick={() => match.chatId && navigate(`/chats/${match.chatId}`)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <Avatar src={match.photos?.[0]} name={match.name} />
                    {/* Chat badge */}
                    <div className="absolute top-2 right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition">
                      <MessageCircle size={15} className="text-white" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm truncate">{match.name}</p>
                    <p className="text-gray-400 text-xs">{match.age ? `${match.age} yrs` : "—"}</p>
                    <div className="mt-2 flex items-center gap-1 text-pink-500 text-xs font-medium">
                      <MessageCircle size={12} />
                      Send message
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Likes tab */}
      {tab === "likes" && (
        <>
          {likes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400 text-center">
              <p className="text-5xl">🤍</p>
              <p className="text-lg font-medium">You haven't liked anyone yet</p>
              <p className="text-sm">Swipe right on someone you like!</p>
              <button
                onClick={() => navigate("/")}
                className="mt-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl text-sm font-medium"
              >
                Discover People
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {likes.map((person) => (
                <div
                  key={person._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="relative">
                    <Avatar src={person.photos?.[0]} name={person.name} />
                    <div className="absolute top-2 right-2 w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center shadow">
                      <Heart size={13} className="text-white fill-white" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm truncate">{person.name}</p>
                    <p className="text-gray-400 text-xs">{person.age ? `${person.age} yrs` : "—"}</p>
                    {person.bio && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{person.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
