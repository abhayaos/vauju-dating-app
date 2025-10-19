import React from 'react';
import { Search, Menu, Plus } from 'lucide-react';

function Header() {
  return (
    <header className="bg-white  p-3 flex items-center sticky top-0 z-50">
      {/* Logo / App Name */}
      <h1 className="text-xl font-bold text-black transition-colors">
        AuraMeet
      </h1>
      {/* Icons on the right */}
      <div className="flex ml-auto items-center space-x-4">
        {/* Search Icon */}
        <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-shadow shadow-sm">
          <Search size={20} />
        </button>

        {/* Add / Plus Icon */}
        <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-shadow shadow-sm">
          <Plus size={20} />
        </button>

        {/* Menu / Hamburger Icon */}
        <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-shadow shadow-sm">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;
