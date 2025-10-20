import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const sections = [
  {
    title: '18+ Content & Safety Guidelines (Girls)',
    content: (
      <div className="space-y-2">
        <p>
          🔞 AuraMeet includes content meant for adults (18+). By using the platform, you agree that:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>You may encounter messages or images intended for mature audiences.</li>
          <li>Sharing or requesting sexual content outside of allowed features is prohibited.</li>
          <li>Harassment or unsolicited sexual messages are forbidden.</li>
          <li>All interactions should be consensual and respectful.</li>
        </ul>
        <p className="font-semibold text-gray-800">
          🚨 Protect yourself: Only interact with verified users and report any suspicious behavior immediately.
        </p>
      </div>
    ),
  },
];

function TermAndCondition() {
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // 3 sec loading
    return () => clearTimeout(timer);
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
      Loading............
      </div>
    );
  }

  return (
    <main className="p-6 md:p-10 max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">AuraMeet</h1>
        <p className="text-gray-700 text-lg md:text-xl">
          🚀 Welcome to <span className="font-semibold text-gray-800">Nepal's first dating platform</span>
        </p>
        <p className="mt-2 text-gray-500">Connect. Chat. Build meaningful relationships. 💖</p>
      </header>

      {/* Welcome Section */}
      <section className="mb-8 space-y-4 text-gray-700">
        <p className="font-semibold">
          We are delighted to grant you access to AuraMeet, Nepal’s first dating platform designed to help individuals connect and build meaningful relationships in a safe and respectful environment. ❤️
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><span className="font-semibold">Create a profile 📝</span> – Share information about yourself and upload photos.</li>
          <li><span className="font-semibold">Discover other users 🔍</span> – Browse and explore profiles that align with your preferences.</li>
          <li><span className="font-semibold">Connect and communicate safely 💬</span> – Exchange messages in a secure manner.</li>
          <li><span className="font-semibold">Report inappropriate behavior 🚨</span> – Maintain a respectful and secure community.</li>
        </ul>
        <p>
          We prioritize your privacy and safety. All shared content is protected, and verified reports of misconduct may result in account or device suspension to ensure a positive experience for all users. 🌟
        </p>
        <p className="font-medium">Enjoy AuraMeet and foster meaningful connections with respect, kindness, and integrity. 💖</p>
      </section>

      {/* Accordion */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="border-b border-gray-300">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center py-4 text-left focus:outline-none"
            >
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              {openIndex === index ? <ChevronUp /> : <ChevronDown />}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-700 py-2"
                >
                  {section.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-gray-500 text-sm mt-10 text-center">
        Last updated: October 2025
      </footer>
    </main>
  );
}

export default TermAndCondition;
