import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

// Resource data
const resourceData = {
  1: {
    categoryName: "Getting Started",
    resources: [
      {
        title: "Getting Started Guide",
        description: "Learn the basics of using Yugal Meet and how to get the most out of your experience.",
        content: `
          <p>Welcome to Yugal Meet! This guide will help you get started with our platform and make the most of your dating experience.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Creating Your Profile</h2>
          <p>Your profile is your first impression on Yugal Meet. Make sure to:</p>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Upload clear, recent photos</li>
            <li>Write a genuine bio that reflects your personality</li>
            <li>Be honest about your interests and intentions</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Finding Matches</h2>
          <p>Our algorithm helps you find compatible matches based on:</p>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Shared interests and hobbies</li>
            <li>Location proximity</li>
            <li>Relationship goals</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Messaging Tips</h2>
          <p>Start conversations with genuine interest:</p>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Reference something specific from their profile</li>
            <li>Ask open-ended questions</li>
            <li>Be respectful and authentic</li>
          </ul>
        `
      },
      {
        title: "Profile Optimization",
        description: "Tips to make your profile stand out and attract more matches.",
        content: `
          <p>A well-crafted profile significantly increases your chances of finding meaningful connections on Yugal Meet.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Photo Tips</h2>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Use high-quality, well-lit photos</li>
            <li>Show your face clearly in at least one photo</li>
            <li>Include a mix of solo and group photos</li>
            <li>Show your interests and hobbies</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Bio Writing</h2>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Be authentic and genuine</li>
            <li>Mention your passions and interests</li>
            <li>Use a conversational tone</li>
            <li>Include conversation starters</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Interest Selection</h2>
          <p>Selecting relevant interests helps our algorithm find better matches:</p>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Choose interests that genuinely reflect your hobbies</li>
            <li>Don't select too many or too few interests</li>
            <li>Update your interests as they change</li>
          </ul>
        `
      }
    ]
  },
  2: {
    categoryName: "Safety & Policies",
    resources: [
      {
        title: "Safety Tips",
        description: "Important safety guidelines to help you have a secure and enjoyable experience.",
        content: `
          <p>Your safety is our top priority. Follow these guidelines to ensure a secure experience on Yugal Meet.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Protecting Your Personal Information</h2>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Never share your full name, address, or financial information with matches</li>
            <li>Use the platform's messaging system initially</li>
            <li>Report suspicious behavior immediately</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Meeting in Person</h2>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Meet in public places for first encounters</li>
            <li>Inform a friend or family member about your plans</li>
            <li>Trust your instincts - if something feels off, don't proceed</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Recognizing Scams</h2>
          <p>Be aware of common dating app scams:</p>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Requests for money or financial assistance</li>
            <li>Stories that seem too good to be true</li>
            <li>Reluctance to video chat or meet in person</li>
          </ul>
        `
      },
      {
        title: "Community Guidelines",
        description: "Our rules and expectations for all members of the Yugal Meet community.",
        content: `
          <p>Yugal Meet is committed to creating a respectful and inclusive community. All members are expected to follow these guidelines.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Respectful Communication</h2>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Treat all members with respect and courtesy</li>
            <li>No harassment, bullying, or hate speech</li>
            <li>Refrain from inappropriate or explicit content</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Authenticity</h2>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Use real photos of yourself</li>
            <li>Be honest in your profile information</li>
            <li>No impersonation or fake profiles</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Prohibited Content</h2>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>No nudity or sexually explicit material</li>
            <li>No spam or promotional content</li>
            <li>No illegal activities or substances</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Consequences of Violations</h2>
          <p>Violations of these guidelines may result in:</p>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Warning messages</li>
            <li>Temporary suspension</li>
            <li>Permanent account termination</li>
          </ul>
        `
      },
      {
        title: "Privacy Policy",
        description: "Learn how we protect your personal information and privacy.",
        content: `
          <p>Yugal Meet is committed to protecting your privacy and personal information. This policy explains how we collect, use, and safeguard your data.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information We Collect</h2>
          <p>We collect information to provide and improve our services:</p>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Account information (name, email, date of birth)</li>
            <li>Profile details (photos, interests, preferences)</li>
            <li>Usage data (interactions, preferences, device information)</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">How We Use Your Information</h2>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>To create and maintain your account</li>
            <li>To match you with compatible users</li>
            <li>To improve our services and user experience</li>
            <li>To communicate with you about our services</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Protection</h2>
          <p>We implement robust security measures to protect your data:</p>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and assessments</li>
            <li>Restricted access to authorized personnel only</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul class="list-disc list-inside text-gray-400 ml-6 mt-3 space-y-2">
            <li>Access and update your personal information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        `
      }
    ]
  }
};

function ResourceDetail() {
  const { categoryId, resourceId } = useParams();
  
  // Get the category and resource data
  const category = resourceData[categoryId];
  const resource = category ? category.resources[resourceId] : null;
  
  // If category or resource not found, show 404
  if (!category || !resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col">
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-6">Resource Not Found</h1>
            <p className="text-gray-400 mb-8">
              The resource you're looking for doesn't exist or has been moved.
            </p>
            <Link 
              to="/help-resources" 
              className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Help Resources
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{resource.title} - Yugal Meet Help</title>
        <meta name="description" content={resource.description} />
        <meta name="keywords" content={`Yugal Meet, ${resource.title}, help, support`} />
        <meta name="author" content="Abhaya Bikram Shahi" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.yugalmeet.com/help-resources/${categoryId}/${resourceId}`} />
        <meta property="og:title" content={`${resource.title} - Yugal Meet Help`} />
        <meta property="og:description" content={resource.description} />
        <meta property="og:image" content="/vite.svg" />
        <meta property="og:site_name" content="Yugal Meet" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://www.yugalmeet.com/help-resources/${categoryId}/${resourceId}`} />
        <meta property="twitter:title" content={`${resource.title} - Yugal Meet Help`} />
        <meta property="twitter:description" content={resource.description} />
        <meta property="twitter:image" content="/vite.svg" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col">
        <main className="flex-grow p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link 
                to="/help-resources" 
                className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Help Resources
              </Link>
              
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <span>Help Resources</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>{category.categoryName}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{resource.title}</h1>
              <p className="text-gray-400 text-lg">{resource.description}</p>
            </div>
            
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-800">
              <div 
                className="resource-content text-gray-300"
                dangerouslySetInnerHTML={{ __html: resource.content }}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              <Link 
                to="/help-resources" 
                className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Categories
              </Link>
              
              <Link 
                to="/" 
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
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
        <footer className="py-8 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Yugal Meet. All rights reserved.
              </div>
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <p className="text-gray-500 text-sm">Founded by Abhaya Bikram Shahi</p>
              </div>
              <div className="flex space-x-5">
                <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300" aria-label="Twitter">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300" aria-label="GitHub">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300" aria-label="Instagram">
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

export default ResourceDetail;