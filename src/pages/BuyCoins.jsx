import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CreditCard, Shield, CheckCircle, WifiOff, Zap, Gem } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

function BuyCoins() {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [loading] = useState(false);

  const coinPackages = [
    {
      id: 1,
      coins: 10,
      price: 10,
      popular: false,
      savings: null,
      description: "Perfect for getting started",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      coins: 10,
      price: 10,
      popular: true,
      savings: "Best Value",
      description: "Most popular choice",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      coins: 10,
      price: 10,
      popular: false,
      savings: null,
      description: "Great for heavy users",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      coins: 10,
      price: 10,
      popular: false,
      savings: null,
      description: "Maximum value",
      color: "from-orange-500 to-red-500"
    }
  ];

  const handlePurchase = (packageId) => {
    alert(`Thank you for purchasing coin package #${packageId}! In a real app, this would redirect to a payment processor.`);
  };

  // Show offline message
  if (!isOnline) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <WifiOff className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            No Internet Connection
          </h2>
          <p className="text-gray-300 mb-4">
            Purchasing coins requires an active internet connection. Please check your connection and try again.
          </p>
          <p className="text-sm text-gray-400">
            Redirecting to home page...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Removed: Animated Background Elements */}

      {/* Connection Status Indicator */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 bg-red-500/10 border-b border-red-500/30 p-3 z-50 flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <WifiOff className="w-4 h-4 text-red-400" />
          <span className="text-red-300 font-medium">No internet connection</span>
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <Gem className="w-12 h-12 text-white" />
              </div>
            </motion.div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 mb-4 leading-tight">
            Get Yugal Coins
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
            Boost your profile, send gifts, and unlock premium features
          </p>
        </motion.div>

        {/* Coin Packages - Enhanced Design */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {coinPackages.map((pkg, idx) => (
            <motion.div 
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className={`rounded-3xl border backdrop-blur-xl transition-all duration-300 overflow-hidden group cursor-pointer ${
                pkg.popular 
                  ? 'border-amber-400 bg-white shadow-xl scale-105 relative' 
                  : 'border-gray-200 bg-white shadow-lg hover:border-purple-300'
              }`}
            >
              {pkg.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 text-xs font-black px-6 py-1.5 rounded-full shadow-lg z-10">
                  ⭐ MOST POPULAR
                </div>
              )}
              
              <div className="p-8 relative h-full flex flex-col">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-5 group-hover:opacity-10 transition`}></div>

                {/* Coin Amount Circle */}
                <div className="text-center mb-8 relative z-10">
                  <motion.div
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`w-24 h-24 bg-gradient-to-br ${pkg.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                  >
                    <span className="text-white font-black text-4xl">{pkg.coins}</span>
                  </motion.div>
                  <h3 className="text-4xl font-black text-gray-900 mb-2">{pkg.coins}</h3>
                  <p className="text-sm text-gray-600 font-semibold">Yugal Coins</p>
                </div>

                {/* Badge */}
                {pkg.savings && (
                  <div className="text-center mb-6 relative z-10">
                    <span className={`inline-block bg-gradient-to-r ${pkg.color} text-white text-sm font-black px-4 py-1.5 rounded-full shadow-lg`}>
                      {pkg.savings}
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-8 text-center relative z-10 flex-grow">
                  <div className="text-5xl font-black text-gray-900 mb-2">
                    रु {pkg.price}
                  </div>
                  <span className="text-gray-600 text-sm font-medium">One-time payment</span>
                </div>

                {/* Description */}
                <p className="text-center text-gray-700 text-sm mb-8 relative z-10 h-10 flex items-center justify-center">
                  {pkg.description}
                </p>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePurchase(pkg.id)}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition duration-300 shadow-xl relative z-10 group/btn overflow-hidden ${
                    pkg.popular
                      ? `bg-gradient-to-r ${pkg.color} text-white hover:shadow-2xl`
                      : `bg-gray-700/50 text-white hover:bg-gray-600/70 border border-gray-600/50`
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    Get Coins Now
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-3xl shadow-lg p-12 mb-16 border border-gray-200 backdrop-blur-xl"
        >
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Why Choose Yugal Coins?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -8 }}
              className="text-center p-8 bg-white rounded-2xl hover:shadow-lg transition border border-gray-200 backdrop-blur-sm"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="font-black text-xl text-gray-900 mb-3">Boost Posts</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Increase visibility and reach more users with post boosting features
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="text-center p-8 bg-white rounded-2xl hover:shadow-lg transition border border-gray-200 backdrop-blur-sm"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CreditCard className="text-white" size={32} />
              </div>
              <h3 className="font-black text-xl text-gray-900 mb-3">Send Gifts</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Show appreciation to users with virtual gifts and special rewards
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="text-center p-8 bg-white rounded-2xl hover:shadow-lg transition border border-gray-200 backdrop-blur-sm"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="font-black text-xl text-gray-900 mb-3">Premium Access</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Unlock exclusive features and access premium user benefits
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Security & Trust */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-gray-50 to-white rounded-3xl p-12 border border-gray-200 shadow-lg backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Secure & Trusted</h2>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                Your payments are securely processed with industry-standard encryption. We never store your complete payment information.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <span className="text-gray-800 font-semibold text-lg">256-bit SSL encryption</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <span className="text-gray-800 font-semibold text-lg">PCI DSS Level 1 compliant</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <span className="text-gray-800 font-semibold text-lg">30-day money-back guarantee</span>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-10 shadow-lg border border-gray-200 text-center backdrop-blur-sm"
              >
                <div className="flex items-center justify-center mb-6">
                  <Shield className="text-green-600" size={64} />
                </div>
                <h3 className="font-black text-2xl text-gray-900 mb-3">
                  Money-Back Guarantee
                </h3>
                <p className="text-gray-700 text-lg">
                  Not satisfied? Get a full refund within 30 days.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="text-center mt-20">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-10 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl font-black text-lg hover:from-gray-700 hover:to-gray-800 transition shadow-lg border border-gray-600 hover:border-gray-500"
          >
            ← Back to Home
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default BuyCoins;