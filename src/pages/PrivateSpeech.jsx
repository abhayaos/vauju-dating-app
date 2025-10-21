import React from 'react';
import { motion } from 'framer-motion';

function PrivateSpeech() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 120, damping: 10, duration: 0.8 }}
      className="flex justify-center items-center h-screen text-3xl font-bold text-pink-500 bg-gradient-to-br from-yellow-200 via-pink-200 to-pink-300 rounded-2xl shadow-xl"
    >
      🎤 Workingg...
    </motion.div>
  );
}

export default PrivateSpeech;
