import React from "react";
import { Helmet } from "react-helmet-async";
import { ShieldCheck, Lock, UserCheck, AlertCircle } from "lucide-react";

function SafetyYugal() {
  return (
    <>
      <Helmet>
        <title>Safety at YugalMeet | Secure Dating in Nepal</title>
        <meta
          name="description"
          content="Learn how YugalMeet ensures safety and security for its users. Verified profiles, privacy protection, and reporting features to create a trusted dating environment in Nepal."
        />
        <link rel="canonical" href="https://www.yugalmeet.com/safety" />
      </Helmet>

      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">

          {/* Hero Section */}
          <section className="text-center max-w-3xl mx-auto">
            <ShieldCheck className="text-pink-500 mx-auto" size={50} />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
              Safety is Our Priority
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              At YugalMeet, we make sure your dating experience is safe, secure, and comfortable. Your privacy and trust are at the core of everything we do.
            </p>
          </section>

          {/* Safety Features */}
          <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">

            <div className="flex items-start gap-4">
              <UserCheck size={40} className="text-pink-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Verified Profiles</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  All users go through a verification process to ensure authenticity. Say goodbye to fake profiles.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Lock size={40} className="text-pink-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Privacy Protection</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Your personal data and chats are encrypted. You have full control over what you share.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <AlertCircle size={40} className="text-pink-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Report & Block</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  If you encounter suspicious behavior, easily report or block users. We take action fast.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <ShieldCheck size={40} className="text-pink-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Secure Environment</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Our platform uses modern security protocols to keep your experience safe and trustworthy.
                </p>
              </div>
            </div>

          </section>

          {/* Tips Section */}
          <section className="mt-24 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Tips for Safe Dating</h2>
            <ul className="text-gray-600 text-left list-disc list-inside space-y-3">
              <li>Never share personal information like bank details or address immediately.</li>
              <li>Meet in public places and let someone know where you are.</li>
              <li>Trust your instincts – if someone feels suspicious, block or report.</li>
              <li>Take your time to get to know someone before committing.</li>
            </ul>
          </section>

        </div>
      </main>
    </>
  );
}

export default SafetyYugal;
