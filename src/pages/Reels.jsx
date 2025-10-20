import React from "react";
import { Loader2 } from "lucide-react"; // nice loading animation icon

function Reels() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 md:ml-24">
      <Loader2 className="w-10 h-10 text-gray-500 animate-spin mb-4" />
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
        We’re building something amazing 🚀
      </h1>
      <p className="text-gray-500 mt-2 max-w-md">
        The <span className="font-medium text-red-500">Reels</span> section is currently
        under development. Stay tuned — it’s gonna be fire 🔥
      </p>
    </div>
  );
}

export default Reels;
