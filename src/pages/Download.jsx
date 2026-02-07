import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Smartphone,
  Apple,
  ShieldCheck,
  Download,
  Heart,
  Users,
  ArrowDown,
} from "lucide-react";

function DownloadYugal() {
  const [showToast, setShowToast] = useState(false);

  const handleDownloadClick = (e) => {
    e.preventDefault();
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  return (
    <>
      <Helmet>
        <title>Download YugalMeet App | Android & iOS</title>
        <meta
          name="description"
          content="Download the YugalMeet app for Android and iOS. Meet genuine people and build meaningful connections safely."
        />
        <link rel="canonical" href="https://www.yugalmeet.com/download" />
      </Helmet>

      <main className="min-h-screen bg-white relative">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Download <span className="text-pink-500">YugalMeet</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Start meeting genuine people and build meaningful relationships.
            Available for Android and iOS.
          </p>

          {/* Download Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Android */}
            <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition flex flex-col items-center">
              <Smartphone size={50} className="text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Android App
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Compatible with Android 8.0 and above
              </p>

              <button
                onClick={handleDownloadClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition shadow"
              >
                <ArrowDown size={16} />
                Get on Play Store
              </button>

              <button
                onClick={handleDownloadClick}
                className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition shadow"
              >
                <Download size={16} />
                Download APK
              </button>
            </div>

            {/* iOS */}
            <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition flex flex-col items-center">
              <Apple size={50} className="text-black mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                iOS App
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Compatible with iOS 13 and above
              </p>

              <button
                onClick={handleDownloadClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-900 transition shadow"
              >
                <ArrowDown size={16} />
                Get on App Store
              </button>

              <button
                onClick={handleDownloadClick}
                className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition shadow"
              >
                <Download size={16} />
                Download IPA
              </button>
            </div>
          </div>

          {/* Trust Section */}
          <div className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-700 text-sm">
            <div className="flex flex-col items-center gap-3">
              <ShieldCheck className="text-pink-500" size={22} />
              <h4 className="font-semibold text-gray-900">Safe & Secure</h4>
              <p className="text-center">
                All profiles are verified and your privacy is our top priority.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Heart className="text-pink-500" size={22} />
              <h4 className="font-semibold text-gray-900">
                Real Connections
              </h4>
              <p className="text-center">
                Meet genuine people and build meaningful relationships.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Users className="text-pink-500" size={22} />
              <h4 className="font-semibold text-gray-900">
                Community Focused
              </h4>
              <p className="text-center">
                Nepal’s growing dating community.
              </p>
            </div>
          </div>
        </div>

        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
            <div className="bg-black text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
              <span>🚧</span>
              <p className="text-sm font-medium">
                App is under development. Coming soon!
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default DownloadYugal;
