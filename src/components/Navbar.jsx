import React from "react";
import {
  Home,
  Sparkles,
  ShieldCheck,
  Info,
  Smartphone,
  Apple,
} from "lucide-react";

function Navbar() {
const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Features",
    href: "/features",
    icon: Sparkles,
  },
  {
    name: "Safety",
    href: "/safety",
    icon: ShieldCheck,
  },
  {
    name: "About",
    href: "/about",
    icon: Info,
  },
];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="h-12 w-12" alt="YugalMeet Logo" />
          <span className="text-lg font-bold text-gray-900">
            Yugal<span className="text-pink-500">Meet</span>
          </span>
        </div>

        {/* Links */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-1 hover:text-pink-500 transition"
            >
              <item.icon size={16} /> {item.name}
            </a>
          ))}
        </nav>

        {/* Download buttons */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition shadow"
          >
            <Smartphone size={16} />
            Android
          </a>

          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-black text-white hover:bg-gray-900 transition shadow"
          >
            <Apple size={16} />
            iOS
          </a>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
