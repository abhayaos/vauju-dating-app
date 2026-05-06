import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Heart,
  MessageCircle,
  Star,
  User,
  Search,
  Sparkles,
  ArrowUp
} from "lucide-react";
import heroImg from "./assets/hero.png";

export default function Landing() {
  return (
    <div className="bg-black text-white overflow-x-hidden max-w-[100vw]">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-black/60 backdrop-blur-md z-50">
        <h1 className="text-pink-500 font-bold text-xl">
          YugalMeet 💕
        </h1>

        <div className="hidden md:flex gap-6 text-sm">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#how">How</a>
          <a href="#contact">Contact</a>
        </div>

        <button className="bg-pink-500 px-4 py-2 rounded-full hover:scale-105 transition">
          Get Started
        </button>
      </nav>

      {/* ================= HERO ================= */}
      <section id="home" className="relative h-screen overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
        />

        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex flex-col justify-center h-full px-6 md:px-20 max-w-2xl"
        >
          <p className="text-pink-400">Find Your Perfect Match 💕</p>

          <h1 className="text-5xl md:text-6xl font-bold">
            Where Hearts <br />
            <span className="text-pink-500">Meet Forever</span>
          </h1>

          <p className="mt-4 text-gray-300">
            YugalMeet connects real people for meaningful relationships.
          </p>

          <div className="mt-6 flex gap-4 flex-wrap">
            <button className="bg-pink-500 px-6 py-3 rounded-full hover:scale-105 transition shadow-lg shadow-pink-500/30">
              Join Now →
            </button>
            <button className="border px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
              Learn More
            </button>
          </div>
        </motion.div>

        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* ================= FEATURE BAR ================= */}
      <div className="relative -mt-16 px-6">
        <div className="mx-auto max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 grid md:grid-cols-4 gap-6">

          <Feature icon={<Shield />} title="Secure" desc="Privacy first" />
          <Feature icon={<Heart />} title="Matching" desc="Smart AI" />
          <Feature icon={<MessageCircle />} title="Chat" desc="Real convos" />
          <Feature icon={<Star />} title="Community" desc="Trusted users" />

        </div>
      </div>

      {/* ================= ABOUT ================= */}
      <section id="about" className="py-24 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-pink-500"
        >
          About YugalMeet
        </motion.h2>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          A modern dating platform focused on real connections, not just swipes.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-24 px-6 bg-zinc-900">
        <h2 className="text-4xl text-center text-pink-500 font-bold">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
          <Card icon={<Heart />} title="Smart Match" />
          <Card icon={<MessageCircle />} title="Live Chat" />
          <Card icon={<Shield />} title="Secure Profiles" />
        </div>
      </section>

      {/* ================= HOW ================= */}
      <section id="how" className="py-24 px-6 text-center">
        <h2 className="text-4xl text-pink-500 font-bold">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
          <Step icon={<User />} text="Create Profile" />
          <Step icon={<Search />} text="Find Matches" />
          <Step icon={<Sparkles />} text="Start Chatting" />
        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section className="py-24 bg-zinc-900 text-center px-6">
        <h2 className="text-4xl text-pink-500 font-bold">
          Love Stories 💖
        </h2>

        <p className="mt-6 text-gray-400 max-w-xl mx-auto italic">
          “We met through YugalMeet and now we’re together forever.”
        </p>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="py-24 text-center px-6">
        <h2 className="text-4xl text-pink-500 font-bold">
          Contact
        </h2>

        <p className="mt-4 text-gray-400">
          support@yugalmeet.com
        </p>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 text-center text-gray-500">
        © 2026 YugalMeet
      </footer>

      {/* 🔥 SCROLL TO TOP */}
      <ScrollToTop />
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-pink-400">{icon}</div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-300">{desc}</p>
      </div>
    </div>
  );
}

function Card({ icon, title }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-black p-6 rounded-xl text-center shadow-lg hover:shadow-pink-500/20 transition overflow-hidden"
    >
      <div className="text-pink-400 flex justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-semibold">{title}</h4>
    </motion.div>
  );
}

function Step({ icon, text }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <div className="text-pink-400 mb-3 flex justify-center">
        {icon}
      </div>
      <p>{text}</p>
    </motion.div>
  );
}

/* ================= SCROLL BUTTON ================= */

function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <button
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 rounded-full shadow-lg shadow-pink-500/40 hover:scale-110 hover:rotate-6 transition"
      >
        <ArrowUp size={20} className="cursor-pointer" />
      </button>
    </div>
  );
}  