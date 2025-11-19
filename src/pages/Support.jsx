import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function Support() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I create an account on Yugal Meet?",
      answer: "To create an account, click on the 'Sign Up' button on the homepage and follow the registration process. You'll need to provide your email address, create a password, and complete your profile information."
    },
    {
      question: "Is Yugal Meet free to use?",
      answer: "Yugal Meet offers both free and premium membership options. Basic features are available for free, while premium features require a subscription. Check out our pricing page for more details."
    },
    {
      question: "How does the matching algorithm work?",
      answer: "Our matching algorithm connects you with people who share similar interests and passions. The more detailed your profile, the better matches we can suggest for you."
    },
    {
      question: "How can I report inappropriate behavior?",
      answer: "If you encounter any inappropriate behavior, please use the 'Report' button on the user's profile or message. Our moderation team will review the report and take appropriate action."
    },
    {
      question: "How do I update my profile information?",
      answer: "You can update your profile information by going to 'Settings' in your account menu. From there, you can edit your personal details, photos, and preferences."
    },
    {
      question: "What should I do if I'm having trouble logging in?",
      answer: "If you're having trouble logging in, try resetting your password using the 'Forgot Password' link. If issues persist, please contact our support team at support@yugalmeet.com or aurameetofficial@gmail.com, or call us at +977 9808370638."
    }
  ];

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Support - Yugal Meet | Get Help & Answers</title>
        <meta name="description" content="Get help with Yugal Meet. Find answers to frequently asked questions, contact support, and access helpful resources for using our dating platform." />
        <meta name="keywords" content="Yugal Meet support, dating app help, FAQ, customer service, account assistance, troubleshooting" />
        <meta name="author" content="Abhaya Bikram Shahi" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="General" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.yugalmeet.com/support" />
        <meta property="og:title" content="Support - Yugal Meet | Get Help & Answers" />
        <meta property="og:description" content="Get help with Yugal Meet. Find answers to frequently asked questions, contact support, and access helpful resources for using our dating platform." />
        <meta property="og:image" content="/vite.svg" />
        <meta property="og:site_name" content="Yugal Meet" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.yugalmeet.com/support" />
        <meta property="twitter:title" content="Support - Yugal Meet | Get Help & Answers" />
        <meta property="twitter:description" content="Get help with Yugal Meet. Find answers to frequently asked questions, contact support, and access helpful resources for using our dating platform." />
        <meta property="twitter:image" content="/vite.svg" />
        <meta property="twitter:site" content="@yugalmeet" />
        
        {/* Additional SEO tags */}
        <link rel="canonical" href="https://www.yugalmeet.com/support" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Yugal Meet Support" />
        <meta name="application-name" content="Yugal Meet Support Center" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col">
        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 pt-8">
              <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-6">
                Support Center
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Find answers to common questions or get in touch with our support team for personalized assistance.
              </p>
            </div>
            
            {/* Contact Information Section */}
            <section className="mb-16">
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-800 shadow-xl">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Contact Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg">
                    <div className="text-indigo-400 mb-4 flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 text-center">Email Support</h3>
                    <p className="text-gray-400 mb-4 text-center">Get in touch with our support team</p>
                    <div className="space-y-2">
                      <a href="mailto:support@yugalmeet.com" className="text-indigo-400 hover:text-indigo-300 transition-colors block text-center font-medium">
                        support@yugalmeet.com
                      </a>
                      <a href="mailto:aurameetofficial@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors block text-center font-medium">
                        aurameetofficial@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg">
                    <div className="text-indigo-400 mb-4 flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 text-center">Phone Support</h3>
                    <p className="text-gray-400 mb-4 text-center">Call us for immediate assistance</p>
                    <a href="tel:+9779808370638" className="text-indigo-400 hover:text-indigo-300 transition-colors block text-center font-medium">
                      +977 9808370638
                    </a>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg">
                    <div className="text-indigo-400 mb-4 flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 text-center">Office Address</h3>
                    <p className="text-gray-400 text-center">
                      Yugal Meet Headquarters<br />
                      Kathmandu, Nepal
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* FAQ Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4 max-w-4xl mx-auto">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden transition-all duration-300 hover:border-indigo-500">
                    <button
                      className="flex justify-between items-center w-full p-6 text-left"
                      onClick={() => toggleFaq(index)}
                    >
                      <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                      <svg 
                        className={`h-6 w-6 text-gray-400 transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {openFaqIndex === index && (
                      <div className="px-6 pb-6 text-gray-300 border-t border-gray-800 pt-4">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
            
            {/* Help Resources Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Help Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg">
                  <div className="bg-indigo-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">Getting Started Guide</h3>
                  <p className="text-gray-400 mb-4">Learn the basics of using Yugal Meet and how to get the most out of your experience.</p>
                  <Link to="/help-resources" className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center font-medium">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg">
                  <div className="bg-indigo-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">Safety Tips</h3>
                  <p className="text-gray-400 mb-4">Important safety guidelines to help you have a secure and enjoyable experience.</p>
                  <Link to="/help-resources" className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center font-medium">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg">
                  <div className="bg-indigo-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">Community Guidelines</h3>
                  <p className="text-gray-400 mb-4">Our rules and expectations for all members of the Yugal Meet community.</p>
                  <Link to="/help-resources" className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center font-medium">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg">
                  <div className="bg-indigo-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">Privacy Policy</h3>
                  <p className="text-gray-400 mb-4">Learn how we protect your personal information and privacy.</p>
                  <Link to="/help-resources" className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center font-medium">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>
            
            {/* CTA Section */}
            <section className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-8 text-center mb-12 border border-indigo-500/30">
              <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
              <p className="text-indigo-200 mb-6 max-w-2xl mx-auto">
                Our support team is here to assist you with any questions or issues you may have with Yugal Meet.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="mailto:support@yugalmeet.com" 
                  className="bg-white text-indigo-900 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Email Support
                </a>
                <Link 
                  to="/" 
                  className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-indigo-900 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </section>
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

export default Support;