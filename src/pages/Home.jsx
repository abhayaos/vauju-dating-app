import React from 'react'
import { Helmet } from 'react-helmet-async'

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
        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center p-4" role="main">
          <div className="text-center max-w-2xl w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Yugal Meet
            </h1>
            <p className="text-xl md:text-2xl text-indigo-600 font-medium mb-16">
              Nepal's leading dating platform
            </p>

            <div className="mt-8">
              <p className="text-base md:text-lg text-gray-600 mb-12 max-w-lg mx-auto">
                Join YugalMeet, Nepal's leading dating platform. Meet singles, create meaningful connections, and find love with like-minded individuals.
              </p>
              <div className="flex justify-center space-x-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" aria-hidden="true"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-3 border-t border-gray-300" role="contentinfo">
        
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-600 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Yugal Meet. All rights reserved.
              </div>
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <p className="text-gray-600 text-sm">Founded by Abhaya Bikram Shahi</p>
              </div>

            
            <div className="mt-4 text-center md:text-right text-gray-500 text-xs">
              <p>v1.0.0</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Home
