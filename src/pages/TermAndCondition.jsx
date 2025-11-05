import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Shield, AlertTriangle, Lock, X, User, Cake, Heart, MessageCircle, AlertCircle } from 'lucide-react';

const sections = [
  {
    title: '18+ Content & Safety Guidelines',
    content: (
      <div className="space-y-4 text-gray-600">
        <p>
          🔞 AuraMeet includes content meant for adults (18+). By using the platform, you agree to:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Encounter messages or images intended for mature audiences.</li>
          <li>Not share or request sexual content outside allowed features.</li>
          <li>Avoid harassment or unsolicited sexual messages.</li>
          <li>Ensure all interactions are consensual and respectful.</li>
        </ul>
        <p className="font-semibold text-gray-800 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-500" />
          Protect yourself: Only interact with verified users and report suspicious behavior immediately.
        </p>
      </div>
    ),
  },
  {
    title: 'Safety for Female Users',
    content: (
      <div className="space-y-4 text-gray-600">
        <p>
          💖 At AuraMeet, we prioritize the safety and comfort of our female users. Our platform is designed to create a secure and empowering environment.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Verified Profiles</strong>: Connect only with users who have passed our strict verification process.</li>
          <li><strong>Privacy Controls</strong>: Customize who can view your profile and messages.</li>
          <li><strong>Instant Reporting</strong>: Flag inappropriate behavior with one tap for immediate review.</li>
          <li><strong>z++ Security</strong>: Advanced encryption and AI monitoring ensure your data and interactions are protected.</li>
        </ul>
        <p className="font-semibold text-gray-800 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-green-500" />
          Your safety is our priority. Explore AuraMeet with confidence.
        </p>
      </div>
    ),
  },
  {
    title: 'Abusive Language & Reporting',
    content: (
      <div className="space-y-4 text-gray-600">
        <p>
          🚫 AuraMeet has zero tolerance for abusive language, including slurs, threats, or manipulative terms. Our AI detects and flags harmful content automatically.
        </p>
        <p><strong>Common Abusive Words & Behaviors:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Direct Insults/Slurs:</strong> Words like "bitch," "asshole," "slut," "fuck off," "STFU" (shut the fuck up), or derogatory name-calling that belittles or harasses.</li>
          <li><strong>Toxic Dating Terms:</strong> "Love bombing" (overwhelming affection to manipulate), "gaslighting" (making you doubt your reality), "ghosting" (sudden disappearance without explanation), "breadcrumbing" (sporadic attention to keep you hooked).</li>
          <li><strong>Harassment Phrases:</strong> Repeated demands like "send nudes," threats ("I'll expose you"), or verbal abuse disguised as jokes ("You're too sensitive").</li>
        </ul>
        <p className="font-semibold text-red-600 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Report immediately: Use one-tap reporting. Violations lead to instant bans under z++ security protocols.
        </p>
      </div>
    ),
  },
];

// Date configuration for terms and conditions updates
const updateDates = {
  previous: new Date('2025-10-16'),
  current: new Date('2025-10-23'),
};

// Function to format dates professionally (e.g., "16 October 2025")
const formatDate = (date) => {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Function to validate and compare dates
const getUpdateStatus = (previous, current) => {
  if (!previous || !current) {
    return { previous: null, current: formatDate(new Date()) };
  }
  return {
    previous: previous < current ? formatDate(previous) : null,
    current: formatDate(current),
  };
};

function TermAndCondition() {
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Get formatted dates
  const { previous, current } = getUpdateStatus(updateDates.previous, updateDates.current);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md p-6 md:p-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
        >
          AuraMeet
        </motion.h1>
        <p className="text-lg md:text-xl text-gray-600">
          🚀 <span className="font-semibold text-gray-800">Nepal's Premier Dating Platform</span>
        </p>
        <p className="mt-2 text-gray-500">Connect. Chat. Build meaningful relationships. 💖</p>
        <button
          onClick={openModal}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 flex items-center mx-auto"
        >
          <Shield className="w-5 h-5 mr-2" />
          Learn About Our Safety Features
        </button>
      </header>

      {/* Main Content */}
      <main className="p-6 md:p-10 max-w-4xl mx-auto">
        {/* Welcome Section */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-blue-500" />
              Welcome to AuraMeet
            </h2>
            <p className="text-gray-600">
              We’re thrilled to introduce <span className="font-semibold">AuraMeet</span>, Nepal’s first dating platform designed to foster meaningful connections in a safe and respectful environment. ❤️
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-600">
              <li><span className="font-semibold">Create a Profile 📝</span> – Showcase your personality with photos and details.</li>
              <li><span className="font-semibold">Discover Matches 🔍</span> – Find profiles that align with your interests.</li>
              <li><span className="font-semibold">Secure Communication 💬</span> – Chat safely with end-to-end encryption.</li>
              <li><span className="font-semibold">Report Misconduct 🚨</span> – Keep our community respectful with easy reporting tools.</li>
            </ul>
            <p className="font-medium text-gray-800">
              Your privacy and safety are our top priorities. All data is protected with z++ security, and verified reports of misconduct may lead to account suspension to ensure a positive experience. 🌟
            </p>
            <div className="flex items-center mt-4">
              <Shield className="w-6 h-6 text-green-500 mr-2" />
              <p className="text-sm text-gray-500">z++ Security: Advanced encryption and AI monitoring for your safety.</p>
            </div>
          </motion.div>
        </section>

        {/* Accordion */}
        <section className="space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition duration-200 focus:outline-none"
              >
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 bg-gray-50"
                  >
                    {section.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Safety Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition duration-200"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
                Safety First
              </h2>
              <p className="text-gray-600 mb-6">
                At AuraMeet, we prioritize your safety, especially for our female users. Our platform includes these key features with z++ security:
              </p>
              <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-4 shadow-inner space-y-4 mb-6">
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <User className="w-5 h-5 mr-3 text-blue-500 mt-0.5" />
                    <div>
                      <strong>Profile Pic:</strong> Upload only respectful, verified photos. We use AI to detect inappropriate images and blur/hide them for privacy. Female users can set visibility to matches only—report altered or fake pics immediately.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Cake className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                    <div>
                      <strong>Age:</strong> All users must verify age (18+ only) via government ID. This prevents underage interactions and ensures consent. z++ security flags age discrepancies; female users get age-range filters for safer browsing.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Heart className="w-5 h-5 mr-3 text-pink-500 mt-0.5" />
                    <div>
                      <strong>Matches:</strong> Matches are based on shared interests and verified profiles only. No unsolicited matches—block or report creepy advances. For women, we limit daily matches and provide "safety scores" based on user behavior history.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MessageCircle className="w-5 h-5 mr-3 text-purple-500 mt-0.5" />
                    <div>
                      <strong>Chatting:</strong> All chats use end-to-end encryption. Keep conversations respectful—no sharing personal info early. AI monitors for red flags like pressure for meets; female users can enable "safe chat mode" to auto-filter explicit content.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-3 text-red-500 mt-0.5" />
                    <div>
                      <strong>Abusive Words:</strong> Zero tolerance for slurs ("bitch," "slut," "asshole"), threats ("fuck off," "STFU"), or manipulative terms ("love bombing," "gaslighting," "ghosting"). AI detects and warns users; repeated offenses lead to bans. Report via one-tap for instant review—your voice matters.
                    </div>
                  </li>
                </ul>
              </div>
              <button
                onClick={closeModal}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
              >
                Got It – Stay Safe
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-gray-500 text-sm py-6 text-center bg-white shadow-inner mt-10">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-base font-semibold text-gray-700 mb-2">Terms & Conditions Updates</h3>
          <div className="flex flex-col md:flex-row md:justify-center md:space-x-8">
            {previous && (
              <p>
                <span className="font-medium">Previous Update:</span> {previous}
              </p>
            )}
            <p>
              <span className="font-medium">Current Update:</span> {current}
            </p>
          </div>
          <p className="mt-4">© AuraMeet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default TermAndCondition;