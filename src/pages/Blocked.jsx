import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertTriangle, ArrowLeft, UserX, Shield, Lock, Ban } from "lucide-react";

function Blocked() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is blocked or doesn't have access
  const isBlocked = !user; // For now, we'll treat non-logged in users as blocked

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Main Content - Centered Card */}
      <div className="w-full max-w-2xl">
        {/* Header with back button for mobile */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back</span>
          </button>
          <div></div> {/* Spacer for alignment */}
        </div>

        {/* Professional Card Design */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4">
              <Ban className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Access Restricted</h1>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {isBlocked 
                  ? "Account Access Required" 
                  : "Blocked Accounts Management"}
              </h2>
              <p className="text-gray-600">
                {isBlocked 
                  ? "Please sign in to access this content." 
                  : "Manage your blocked accounts and privacy settings."}
              </p>
            </div>
            
            {isBlocked ? (
              <div className="bg-red-50 rounded-xl p-6 mb-8 border border-red-100">
                <h3 className="font-semibold text-lg text-red-800 mb-4 flex items-center justify-center">
                  <Ban className="h-5 w-5 mr-2" />
                  Access Denied
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Your access to this content has been restricted. If you believe this is an error, please contact support.
                </p>
                <ul className="space-y-3 text-sm text-red-700">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-0.5">•</span>
                    <span>You cannot view or interact with blocked content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-0.5">•</span>
                    <span>This restriction applies to all blocked accounts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-0.5">•</span>
                    <span>Contact support for further assistance</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center justify-center">
                  <Shield className="h-5 w-5 mr-2 text-red-500" />
                  Blocking Features
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  When you block someone, they won't be able to:
                </p>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-0.5">•</span>
                    <span>See your profile, posts, or stories</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-0.5">•</span>
                    <span>Contact you or send messages</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-0.5">•</span>
                    <span>Tag you in posts or comments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-0.5">•</span>
                    <span>See when you're online or active</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3 mt-0.5">•</span>
                    <span>Add you as a friend or follow you</span>
                  </li>
                </ul>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Go Back
              </button>
              
              {!isBlocked && user && (
                <button
                  onClick={() => navigate("/settings")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition"
                >
                  Privacy Settings
                </button>
              )}
              
              {isBlocked && (
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              © {new Date().getFullYear()} AuraMeet. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blocked;