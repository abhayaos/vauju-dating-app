import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function HelpResources() {
  const [activeCategory, setActiveCategory] = useState(1);

  const categories = [
    {
      id: 1,
      name: "Getting Started",
      resources: [
        {
          title: "Getting Started Guide",
          description: "Learn the basics of using Yugal Meet and how to get the most out of your experience."
        },
        {
          title: "Profile Optimization",
          description: "Tips to make your profile stand out and attract more matches."
        }
      ]
    },
    {
      id: 2,
      name: "Safety & Policies",
      resources: [
        {
          title: "Safety Tips",
          description: "Important safety guidelines to help you have a secure and enjoyable experience."
        },
        {
          title: "Community Guidelines",
          description: "Our rules and expectations for all members of the Yugal Meet community."
        },
        {
          title: "Privacy Policy",
          description: "Learn how we protect your personal information and privacy."
        }
      ]
    }
  ];

  // Get the active category
  const activeCategoryData = categories.find(cat => cat.id === activeCategory) || categories[0];

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": activeCategoryData.resources.map(resource => ({
      "@type": "Question",
      "name": resource.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": resource.description
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Help Resources - Yugal Meet | Dating App Guides & Safety Tips</title>
        <meta name="description" content="Comprehensive help resources for Yugal Meet users. Find guides on getting started, safety tips, community guidelines, and privacy policy to enhance your dating experience." />
        <meta name="keywords" content="Yugal Meet help, dating app resources, safety tips, community guidelines, privacy policy, getting started guide, online dating safety" />
        <meta name="author" content="Abhaya Bikram Shahi" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="General" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.yugalmeet.com/help-resources" />
        <meta property="og:title" content="Help Resources - Yugal Meet | Dating App Guides & Safety Tips" />
        <meta property="og:description" content="Comprehensive help resources for Yugal Meet users. Find guides on getting started, safety tips, community guidelines, and privacy policy to enhance your dating experience." />
        <meta property="og:image" content="/vite.svg" />
        <meta property="og:site_name" content="Yugal Meet" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.yugalmeet.com/help-resources" />
        <meta property="twitter:title" content="Help Resources - Yugal Meet | Dating App Guides & Safety Tips" />
        <meta property="twitter:description" content="Comprehensive help resources for Yugal Meet users. Find guides on getting started, safety tips, community guidelines, and privacy policy to enhance your dating experience." />
        <meta property="twitter:image" content="/vite.svg" />
        <meta property="twitter:site" content="@yugalmeet" />
        
        {/* Additional SEO tags */}
        <link rel="canonical" href="https://www.yugalmeet.com/help-resources" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Yugal Meet Help" />
        <meta name="application-name" content="Yugal Meet Help Resources" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col">
        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 pt-8">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Help Resources
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Find helpful information and guides to enhance your Yugal Meet experience.
              </p>
            </div>
            
            {/* Category Toggle */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex p-1 bg-gray-200 rounded-lg">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                      activeCategory === category.id
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {category.id}. {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCategoryData.resources.map((resource, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-500 transition-all duration-300 flex flex-col shadow-sm"
                  style={{ minHeight: '200px' }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{resource.title}</h2>
                  <p className="text-gray-700 mb-4 flex-grow">{resource.description}</p>
                  <div className="mt-auto pt-4">
                    <Link 
                      to={`/help-resources/${activeCategory}/${index}`} 
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
                    >
                      Read More
                      <svg 
                        className="h-4 w-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Single Go Home Button */}
            <div className="text-center mt-12">
              <Link 
                to="/" 
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Home
              </Link>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-8 border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-600 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Yugal Meet. All rights reserved.
              </div>
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <p className="text-gray-600 text-sm">Founded by Abhaya Bikram Shahi</p>
              </div>
              <div className="flex space-x-5">
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300" aria-label="Twitter">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300" aria-label="GitHub">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300" aria-label="Instagram">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-4 text-center md:text-right text-gray-600 text-xs">
              <p>v1.0.0</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default HelpResources;