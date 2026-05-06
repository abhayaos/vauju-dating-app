import React, { useState, useEffect, useRef } from "react";
import TinderCard from "react-tinder-card";
import { X, Heart, Info, RotateCcw } from "lucide-react";
import { api } from "../api";

const CARD_W = 340;
const CARD_H = 500;

export default function Discover() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [matchedUser, setMatchedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const cardRefs = useRef([]);
  const currentIndexRef = useRef(-1);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProfiles();
      const p = data.profiles || [];
      cardRefs.current = p.map(() => React.createRef());
      setProfiles(p);
      setCurrentIndex(p.length - 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfiles(); }, []);

  const sendSwipe = async (targetUserId, direction) => {
    try {
      const data = await api.swipe({ targetUserId, direction });
      if (data.matched) setMatchedUser(data.matchedUser);
    } catch (err) {
      console.error("Swipe error:", err.message);
    }
  };

  // Fired by TinderCard when card leaves screen (drag OR programmatic)
  const onSwipe = (direction, profile, index) => {
    setCurrentIndex(index - 1);
    sendSwipe(profile._id, direction === "right" ? "like" : "pass");
  };

  // Buttons trigger programmatic swipe via ref → fires onSwipe above
  const swipeCard = async (dir) => {
    const idx = currentIndexRef.current;
    if (idx < 0) return;
    const ref = cardRefs.current[idx];
    if (ref?.current) await ref.current.swipe(dir);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-red-500">{error}</p>
      <button onClick={fetchProfiles} className="px-4 py-2 bg-black text-white rounded-xl">Retry</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-start pt-4 h-full overflow-hidden select-none">

      {/* ── Match overlay ── */}
      {matchedUser && (
        <div className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center gap-5 px-4">
          <div className="text-6xl animate-bounce">💘</div>
          <p className="text-white text-3xl font-bold text-center">It's a Match!</p>
          {matchedUser.photos?.[0]
            ? <img src={matchedUser.photos[0]} alt={matchedUser.name} className="w-28 h-28 rounded-full object-cover border-4 border-pink-400 shadow-xl" />
            : <div className="w-28 h-28 rounded-full bg-pink-400 flex items-center justify-center text-white text-4xl font-bold border-4 border-white">{matchedUser.name?.[0]}</div>
          }
          <p className="text-white text-xl font-medium">{matchedUser.name}</p>
          <button onClick={() => setMatchedUser(null)} className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition">
            Keep Swiping
          </button>
        </div>
      )}

      {/* ── Expanded overlay ── */}
      {expanded && (
        <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4" onClick={() => setExpanded(null)}>
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {expanded.photos?.[0]
              ? <img src={expanded.photos[0]} alt={expanded.name} className="w-full h-64 object-cover" />
              : <div className="w-full h-64 bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-6xl font-bold">{expanded.name?.[0]}</div>
            }
            <div className="p-5">
              <h2 className="text-2xl font-bold">{expanded.name}{expanded.age ? `, ${expanded.age}` : ""}</h2>
              <p className="text-gray-600 mt-2 text-sm">{expanded.bio}</p>
              {expanded.interests?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {expanded.interests.map((i) => (
                    <span key={i} className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">{i}</span>
                  ))}
                </div>
              )}
              <button onClick={() => setExpanded(null)} className="mt-4 w-full py-2.5 bg-black text-white rounded-2xl font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── No more cards ── */}
      {currentIndex < 0 ? (
        <div className="flex flex-col items-center gap-4 text-gray-400 px-4 text-center mt-20">
          <p className="text-5xl">🌸</p>
          <p className="text-xl font-medium">No more profiles</p>
          <p className="text-sm">Check back later for new people!</p>
          <button onClick={fetchProfiles} className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-2xl text-sm font-medium hover:bg-gray-800 transition">
            <RotateCcw size={15} /> Refresh
          </button>
        </div>
      ) : (
        <>
          {/* ── Card stack ──
              Key: TinderCard's child must have explicit width+height and
              position:relative (NOT absolute) so the drag gesture works.
              We stack cards using z-index only.
          ── */}
          <div
            className="relative flex-shrink-0"
            style={{ width: CARD_W, height: CARD_H }}
          >
            {profiles.map((profile, index) => (
              <TinderCard
                ref={cardRefs.current[index]}
                key={profile._id}
                onSwipe={(dir) => onSwipe(dir, profile, index)}
                preventSwipe={["up", "down"]}
                swipeRequirementType="position"
                swipeThreshold={80}
              >
                {/* Must be relative + explicit size — no absolute here */}
                <div
                  className="rounded-3xl shadow-2xl overflow-hidden bg-white cursor-grab active:cursor-grabbing"
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: index,
                  }}
                >
                  {/* Photo fills top 75% */}
                  <div className="relative" style={{ height: "75%" }}>
                    {profile.photos?.[0] ? (
                      <img
                        src={profile.photos[0]}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-7xl font-bold">
                        {profile.name?.[0]}
                      </div>
                    )}

                    {/* Dark gradient at bottom of photo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Info button */}
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); setExpanded(profile); }}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition z-10"
                    >
                      <Info size={17} className="text-gray-700" />
                    </button>
                  </div>

                  {/* Info strip — bottom 25% */}
                  <div className="px-4 py-3 bg-white" style={{ height: "25%" }}>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">
                      {profile.name}{profile.age ? `, ${profile.age}` : ""}
                    </h2>
                    {profile.bio && (
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{profile.bio}</p>
                    )}
                    {profile.interests?.length > 0 && (
                      <div className="flex gap-1.5 mt-2 overflow-hidden">
                        {profile.interests.slice(0, 3).map((i) => (
                          <span key={i} className="flex-shrink-0 px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full text-xs font-medium border border-pink-100">
                            {i}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TinderCard>
            ))}
          </div>

          {/* ── Action buttons ── */}
          <div className="flex items-center gap-5 mt-6 flex-shrink-0">
            <button
              onClick={() => swipeCard("left")}
              className="w-16 h-16 rounded-full bg-white border-2 border-red-200 text-red-400 flex items-center justify-center shadow-lg hover:scale-110 hover:border-red-400 hover:text-red-500 active:scale-95 transition-all"
            >
              <X size={26} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => swipeCard("right")}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <Heart size={30} strokeWidth={2} className="fill-white" />
            </button>

            <button
              onClick={fetchProfiles}
              className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center shadow-lg hover:scale-110 hover:border-gray-400 active:scale-95 transition-all"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
