import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Shield, Heart, Users, AlertTriangle, Lock, UserCheck } from "lucide-react";

function TermAndCondition() {
  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start mb-6">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
            <p className="text-gray-700">
              🔞 YugalMeet includes content meant for adults (18+). By using the platform, you agree to:
            </p>
          </div>
          
          <ul className="list-disc pl-8 space-y-2 text-gray-700">
            <li>Be at least 18 years old</li>
            <li>Not share personal information of minors</li>
            <li>Report any suspicious activity involving minors</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-pink-50 p-6 rounded-lg">
            <Heart className="h-8 w-8 text-pink-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Safety First</h3>
            <p className="text-gray-700">
              💖 At YugalMeet, we prioritize the safety and comfort of our female users. Our platform is designed to create a secure and empowering environment.
            </p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <Lock className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy Protection</h3>
            <p className="text-gray-700">
              Your safety is our priority. Explore YugalMeet with confidence.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
            <h3 className="text-xl font-bold text-gray-900">Zero Tolerance Policy</h3>
          </div>
          <p className="text-gray-700 mb-4">
            🚫 YugalMeet has zero tolerance for abusive language, including slurs, threats, or manipulative terms. Our AI detects and flags harmful content automatically.
          </p>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">
              <strong>Violations result in:</strong> Immediate account suspension and potential permanent banning.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">YugalMeet Terms of Service</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
              <p className="text-gray-700">
                By accessing or using YugalMeet, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. User Responsibilities</h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-700">
                <li>Maintain accurate and up-to-date profile information</li>
                <li>Refrain from posting false or misleading information</li>
                <li>Respect other users and their privacy</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Prohibited Activities</h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-700">
                <li>Harassment, bullying, or threatening behavior</li>
                <li>Sharing explicit or inappropriate content</li>
                <li>Impersonating others or creating fake profiles</li>
                <li>Using the platform for illegal activities</li>
                <li>Attempting to hack or exploit the platform</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Intellectual Property</h3>
              <p className="text-gray-700">
                All content, logos, and materials on YugalMeet are the property of YugalMeet and protected by copyright laws.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Limitation of Liability</h3>
              <p className="text-gray-700">
                YugalMeet is not liable for any damages arising from the use of our platform or interactions between users.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">6. Termination</h3>
              <p className="text-gray-700">
                We reserve the right to terminate or suspend accounts that violate these terms without prior notice.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Community Guidelines</h2>
          <p className="mb-4">
            We're thrilled to introduce <span className="font-semibold">YugalMeet</span>, Nepal's first dating platform designed to foster meaningful connections in a safe and respectful environment. ❤️
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <UserCheck className="h-6 w-6 mb-2" />
              <h3 className="font-semibold mb-1">Authenticity</h3>
              <p className="text-sm">Be genuine and honest in your profile and interactions</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <Users className="h-6 w-6 mb-2" />
              <h3 className="font-semibold mb-1">Respect</h3>
              <p className="text-sm">Treat all members with kindness and consideration</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <Shield className="h-6 w-6 mb-2" />
              <h3 className="font-semibold mb-1">Safety</h3>
              <p className="text-sm">Protect your personal information and meet in safe locations</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <Heart className="h-6 w-6 mb-2" />
              <h3 className="font-semibold mb-1">Inclusivity</h3>
              <p className="text-sm">Embrace diversity and create an inclusive environment</p>
            </div>
          </div>
          
          <p>
            At YugalMeet, we prioritize your safety, especially for our female users. Our platform includes these key features with z++ security:
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">📧 support@yugameet.com</p>
            <p className="font-semibold">📍 Kathmandu, Nepal</p>
          </div>
          <p className="mt-4 text-gray-700">
            By using YugalMeet, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
          </p>
        </div>

        <div className="text-center mt-8 text-gray-600">
          <p>© YugalMeet. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default TermAndCondition;
