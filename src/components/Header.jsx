import React from "react";
import { Search, Menu, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white  p-3 flex items-center sticky top-0 z-50">
      {/* Logo / App Name */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold text-black  cursor-pointer select-none"
      >
        YugalMeet
      </h1>

      {/* Icons on the right */}
      <div className="flex ml-auto items-center space-x-3">
        {/* Search */}
        <button
          onClick={() => navigate("/search")}
          className="bg-gray-100  hover:bg-gray-200  p-2 rounded-full transition-all duration-200"
        >
          <Search size={20} />
        </button>

        {/* Create / Add */}
        <button
          onClick={() => navigate("/create")}
          className="bg-gray-100  hover:bg-gray-200 p-2 rounded-full transition-all duration-200"
        >
          <Plus size={20} />
        </button>

        {/* Menu / Navigation */}
        <button
          onClick={() => navigate("/menu")}
          className="bg-gray-100  hover:bg-gray-200 p-2 rounded-full transition-all duration-200"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;
