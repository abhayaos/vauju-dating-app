import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Mail, Phone, AlertCircle } from "lucide-react";

// Date configuration for terms and conditions updates (from TermAndCondition)
const updateDates = {
  previous: new Date("2025-10-16"),
  current: new Date("2025-10-23"),
};

// Function to format dates professionally (e.g., "16 October 2025")
const formatDate = (date) => {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8 text-gray-600">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold">Something went wrong!</h2>
          <p className="mt-2">Please try refreshing the page or contact support.</p>
          <p className="text-sm text-gray-500 mt-2">Error: {this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function NameChanging() {
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get formatted dates
  const { previous, current } = getUpdateStatus(updateDates.previous, updateDates.current);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold mb-4 text-gray-800"
          >
            How to Change Your Name & Profile on Aurameet ✨
          </motion.h1>
          <p className="text-gray-600 sm:text-lg mb-4">
            Keep your profile fresh and recognizable by updating your display name and profile picture in Aurameet. Follow this simple guide to personalize your account.
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Shield className="w-4 h-4 mr-2 text-green-500" />
            z++ Security: Your profile data is protected with advanced encryption.
          </div>
        </section>

        {/* Blog Content */}
        <section className="bg-white shadow-lg rounded-xl p-6 sm:p-8 space-y-8">
          {/* Updating Your Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <User className="w-6 h-6 mr-2 text-blue-500" />
              1. Updating Your Name
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-3 bg-white bg-opacity-80 rounded-lg p-4 shadow-inner">
              <li>
                Navigate to the <strong>Edit Profile</strong> section in your account settings.
              </li>
              <li>
                Update your <strong>Name</strong> fields with a recognizable name.
              </li>
              <li>
                Click <strong>Save</strong> to apply changes, secured with z++ encryption.
              </li>
            </ul>
            <p className="text-gray-600 italic text-sm">
              💖 Tip for female users: Use a name that feels safe and comfortable for you. You can hide your full name from non-matches.
            </p>
          </motion.div>

          {/* Tips & Tricks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-green-500" />
              2. Tips & Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-3 bg-white bg-opacity-80 rounded-lg p-4 shadow-inner">
              <li>
                Use a square image for your profile picture for best display (e.g., 1:1 ratio, at least 200x200 pixels).
              </li>
              <li>
                Keep your name recognizable so matches can find you easily, but avoid sharing sensitive personal info.
              </li>
              <li>
                If you face issues, contact our <strong>Support</strong> team for immediate assistance.
              </li>
            </ul>
            <p className="text-gray-600 italic text-sm">
              🚨 All profile updates are moderated with z++ security to ensure a safe, respectful community.
            </p>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-800 font-medium text-base sm:text-lg"
          >
            <a
              href="tel:+9779808370638"
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-blue-600"
            >
              <Phone className="w-5 h-5" />
              +977-9808370638
            </a>
            <a
              href="mailto:aurameetofficial@gmail.com"
              className="flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-lg hover:bg-pink-100 transition text-pink-600 break-all"
            >
              <Mail className="w-5 h-5" />
              aurameetofficial@gmail.com
            </a>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="text-gray-500 text-sm py-6 text-center mt-12 bg-white shadow-inner">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 italic text-base mb-4">
              Keep your profile updated and enjoy a personalized Aurameet experience! 🌟
            </p>
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
            <p className="mt-4">© 2025 Aurameet. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default NameChanging;