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
      answer: "Click 'Sign Up' on the homepage and follow the steps. Add your email, password, and fill out your profile."
    },
    {
      question: "Is Yugal Meet free to use?",
      answer: "Yes. Basic features are free. Premium features require a subscription."
    },
    {
      question: "How does the matching algorithm work?",
      answer: "We match users based on interests, behaviour, and profile data."
    },
    {
      question: "How can I report inappropriate behavior?",
      answer: "Use the 'Report' button on a profile or message."
    },
    {
      question: "How do I update my profile?",
      answer: "Go to Settings → Profile Info → Update your details."
    },
    {
      question: "Login not working. What do I do?",
      answer: "Reset password from 'Forgot Password'. If still stuck, mail support@yugalmeet.com."
    }
  ];

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
        <title>Support - Yugal Meet</title>
        <meta name="description" content="Get help, FAQ answers, and support for Yugal Meet." />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      

      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col">

        {/* MAIN */}
        <main className="flex-grow p-4 md:p-8">
          <div className="max-w-6xl mx-auto">

            {/* Heading */}
            <div className="text-center mb-12 pt-8">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Support Center
              </h1>
              <p className="text-gray-700 text-lg">
                FAQs, help resources & customer support.
              </p>
            </div>

            {/* CONTACT SECTION */}
            <section className="mb-16">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Us</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Email */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-indigo-500 transition">
                    <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Email Support</h3>
                    <p className="text-gray-700 text-center mb-4">We're here to help anytime.</p>
                    <div className="space-y-1 text-center">
                     
                      <a href="mailto:aurameetofficial@gmail.com" className="text-indigo-600 hover:text-indigo-700 font-medium block">
                        aurameetofficial@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-indigo-500 transition">
                    <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Phone Support</h3>
                    <p className="text-gray-700 text-center mb-4">Call us anytime.</p>
                    <a href="tel:+9779808370638" className="text-indigo-600 hover:text-indigo-700 font-medium block text-center">
                      +977 9808370638
                    </a>
                  </div>

                  {/* Office */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-indigo-500 transition">
                    <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Office Address</h3>
                    <p className="text-gray-700 text-center">
                      Yugal Meet HQ<br />
                      Kathmandu, Nepal
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>

              <div className="space-y-4 max-w-4xl mx-auto">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 transition hover:border-indigo-500 shadow-sm">
                    <button
                      className="w-full p-6 flex justify-between items-center text-left"
                      onClick={() => toggleFaq(index)}
                    >
                      <h3 className="text-gray-900 text-lg font-semibold">{faq.question}</h3>
                      <div className={`text-gray-500 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                        ▼
                      </div>
                    </button>

                    {openFaqIndex === index && (
                      <div className="px-6 pb-6 text-gray-700 border-t border-gray-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Founder Details */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">About Our Founder</h2>
              
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <img 
                      src="https://www.abhayabikramshahi.xyz/images/abhaya1.jpg" 
                      alt="Abhaya Bikram Shahi, Founder & CEO of Yugal Meet" 
                      className="w-48 h-48 rounded-xl object-cover border-4 border-indigo-100"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Abhaya Bikram Shahi</h3>
                    <p className="text-indigo-600 font-medium mb-4">Founder & CEO, Yugal Meet</p>
                    <p className="text-gray-700 mb-4">
                      Abhaya Bikram Shahi is a visionary entrepreneur with a passion for connecting people through technology. 
                      With years of experience in software development and digital innovation, he founded Yugal Meet to 
                      revolutionize the dating landscape in Nepal.
                    </p>
                    <p className="text-gray-700">
                      His mission is to create a safe, inclusive, and meaningful platform where people can find genuine 
                      connections and lasting relationships. Under his leadership, Yugal Meet has become Nepal's leading 
                      dating platform, helping thousands of people find love and companionship.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* HELP RESOURCES */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Help Resources</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Getting Started", text: "Learn the basics of using Yugal Meet." },
                  { title: "Safety Tips", text: "Stay safe while meeting new people." },
                  { title: "Community Rules", text: "Understand our guidelines and policies." },
                  { title: "Account Help", text: "Fix login and profile-related issues." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-500 transition shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700 mb-4">{item.text}</p>
                    <Link to="/help-resources" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Learn more →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="w-full py-6 border-t border-gray-200 text-center text-gray-600 text-sm bg-white">
          © {new Date().getFullYear()} Yugal Meet. All rights reserved.
        </footer>
      </div>

      {/* Remove loading after delay */}
      <script>
        {`
          setTimeout(() => {
            const el = document.getElementById('loading-screen');
            if (el) el.style.display = 'none';
          }, 800);
        `}
      </script>
    </>
  );
}

export default Support;