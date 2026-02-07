import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Heart, ShieldCheck, Users } from "lucide-react";
import Preview from '../assets/preview.png'
function Home() {
  return (
    <>
      <Helmet>
        <title>Yugal Meet - Connect with Like-Minded People</title>
        <meta name="description" content="Join YugalMeet, Nepal's leading dating platform. Meet singles, create meaningful connections, and find love with like-minded individuals." />
        <meta name="keywords" content="Yugal Meet, dating app, social networking, meet people, connections, relationships, interests, passions, Nepal dating" />
        <meta name="author" content="Abhaya Bikram Shahi" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="General" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.yugalmeet.com/" />
        <meta property="og:title" content="Yugal Meet - Connect with Like-Minded People" />
        <meta property="og:description" content="Join YugalMeet, Nepal's leading dating platform. Meet singles, create meaningful connections, and find love with like-minded individuals." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:site_name" content="Yugal Meet" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.yugalmeet.com/" />
        <meta property="twitter:title" content="Yugal Meet - Connect with Like-Minded People" />
        <meta property="twitter:description" content="Join YugalMeet, Nepal's leading dating platform. Meet singles, create meaningful connections, and find love with like-minded individuals." />
        <meta property="twitter:image" content="/logo.png" />
        <meta property="twitter:site" content="@yugalmeet" />

        {/* Additional SEO */}
        <link rel="canonical" href="https://www.yugalmeet.com/" />
        <meta name="theme-color" content="#ffffff" />
      </Helmet>

      <div className="min-h-screen bg-white flex flex-col">
  {/* HERO */}
      <main className="min-h-screen bg-white flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Find real connections <br />
              on <span className="text-pink-500">YugalMeet</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              Nepal’s trusted dating platform to meet genuine people, build
              meaningful relationships, and connect with confidence.
            </p>

            {/* CTA */}
            <div className="mt-8 flex gap-4">
              <a
                href="/download"
                className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition shadow"
              >
                Get the App
              </a>
              <a
                href="/features"
                className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:border-pink-500 hover:text-pink-500 transition"
              >
                Learn More
              </a>
            </div>

            {/* Trust Signals */}
            <div className="mt-10 flex gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-pink-500" />
                Real profiles
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-pink-500" />
                Safe & secure
              </div>
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-pink-500" />
                Meaningful matches
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden md:flex justify-center">
            <img
              src={Preview}
              alt="YugalMeet App Preview"
              className="w-full h-80` rounded-2xl shadow-lg"
            />
          </div>

        </div>
      </main>

     
      </div>
    </>
  )
}

export default Home
