import React, { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import Header from "../components/Header";

function Messages() {
  const [isOnline, setIsOnline] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsOnline(false);
  }, []);

  const retryConnection = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      setIsOnline(false);
    }, 1500);
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse flex-1 flex flex-col items-center justify-center p-10">
      <div className="w-24 h-24 bg-gray-300 rounded-full mb-6"></div>
      <div className="h-6 bg-gray-300 rounded w-64 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-72"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col md:pl-[70px] w-full">
          <div className="md:hidden sticky top-0 z-50 bg-white shadow-sm">
            <Header />
          </div>
          <div className="md:hidden sticky top-[64px] z-40 bg-white shadow-sm">
            <MobileNavbar />
          </div>
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="flex-1 flex flex-col md:pl-[70px] w-full">
       

        {/* Offline Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className=" p-4 flex items-center justify-between mt-2  rounded-b-lg shadow-sm"
        >
          <div className="flex items-center gap-3">
            <WifiOff className="w-6 h-6 " />
            <div>
              <p className="font-semibold text-gray-800">No Internet Connection</p>
              <p className="text-sm text-black">
                Messages are unavailable offline.{" "}
                <button
                  onClick={() => setShowErrorDetails(true)}
                  className="underline font-semibold hover:text-gray-800"
                >
                  Read More
                </button>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={retryConnection}
              disabled={retrying}
              className={`text-sm font-medium px-4 py-2 rounded-full transition duration-300 ${
                retrying
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed animate-pulse"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              }`}
            >
              {retrying ? "Retrying..." : "Retry"}
            </button>
          </div>
        </motion.div>

        {/* Main Offline Body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center"
        >
          <WifiOff className="w-20 h-20 text-gray-300 mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Messages Unavailable
          </h2>
          <p className="text-gray-600 max-w-lg mb-6">
            You’re currently offline. Connect to the internet to view or send your messages.{" "}
            <button
              onClick={() => setShowErrorDetails(true)}
              className="underline font-semibold hover:text-gray-900"
            >
              Read More
            </button>
          </p>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-md w-full"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Our support team is ready to assist you anytime.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="font-medium text-gray-800">WhatsApp Support</p>
              <p className="text-blue-600 font-mono text-lg mt-1">9808370638</p>
              <p className="text-xs text-gray-500 mt-1">Available 24/7</p>
            </div>
          </motion.div>
        </motion.div>

        {/* More Info Modal */}
        <AnimatePresence>
          {showErrorDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative p-6 overflow-y-auto max-h-[90vh]"
              >
                <button
                  onClick={() => setShowErrorDetails(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg font-bold"
                >
                  ✕
                </button>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  More Info
                </h3>

                <div className="bg-gray-50 border border-[#ccc] rounded-lg p-4 text-gray-700">
                  <p className="font-semibold text-gray-800">Working Soon</p>
                  <p className="mt-1">
                    This section is under development. More details and insights will be available in future updates.
                  </p>
                  <p className="mt-2 font-medium text-gray-800">
                    Contact Support: <span className="text-blue-600 font-mono">9808370638</span>
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowErrorDetails(false)}
                    className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Messages;
