import React, { useState } from "react";
import TinderCard from "react-tinder-card";

const users = [
  {
    name: "Riya",
    age: 21,
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  },
  {
    name: "Sana",
    age: 22,
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
  {
    name: "Aarav",
    age: 23,
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(users.length - 1);

  const swiped = (direction, name) => {
    console.log(`${name} swiped ${direction}`);
    setCurrentIndex((prev) => prev - 1);
  };

  const outOfFrame = (name) => {
    console.log(`${name} left screen`);
  };

  const swipe = (dir) => {
    if (currentIndex >= 0) {
      const user = users[currentIndex];
      console.log(`${user.name} swiped ${dir}`);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-pink-50 to-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* Header */}
      <div className="absolute top-5 text-xl font-bold text-pink-500">
        💘 YugalMeet
      </div>

      {/* Card Stack */}
      <div className="relative w-full flex justify-center items-center">
        {users.map((user, index) => (
          <TinderCard
            key={user.name}
            className={`absolute`}
            onSwipe={(dir) => swiped(dir, user.name)}
            onCardLeftScreen={() => outOfFrame(user.name)}
            preventSwipe={["up", "down"]}
          >
            <div
              className="
                bg-white rounded-3xl shadow-xl overflow-hidden
                flex flex-col
                transition-all duration-300
                w-[90vw] h-[70vh]
                md:w-[320px] md:h-[500px]
                hover:scale-[1.02]
              "
            >
              {/* Image */}
              <img
                src={user.img}
                alt={user.name}
                className="w-full h-[75%] object-cover"
              />

              {/* Info */}
              <div className="p-4 flex flex-col gap-1">
                <h2 className="text-xl font-bold">
                  {user.name}, {user.age}
                </h2>
                <p className="text-gray-500 text-sm">
                  Swipe right to connect 💕
                </p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>

      {/* Desktop Buttons (hidden on mobile) */}
      <div className="hidden md:flex gap-6 absolute bottom-10">
        <button
          onClick={() => swipe("left")}
          className="w-14 h-14 rounded-full bg-red-500 text-white text-xl shadow-lg hover:scale-110 transition"
        >
          ✖
        </button>

        <button
          onClick={() => swipe("right")}
          className="w-14 h-14 rounded-full bg-green-500 text-white text-xl shadow-lg hover:scale-110 transition"
        >
          ♥
        </button>
      </div>
    </div>
  );
}