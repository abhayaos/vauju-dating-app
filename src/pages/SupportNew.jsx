import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MessageCircle, HelpCircle, Shield, User, Heart, Clock, MapPin, Send } from "lucide-react";
import Layout from "../components/Layout";

function Support() {
  const [activeTab, setActiveTab] = useState("faq");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  const faqItems = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button on the homepage. You'll need to provide your basic information, create a username and password, and verify your email address. Once verified, you can start exploring profiles and connecting with others."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We use industry-standard encryption to protect your data. Your personal information is never shared with third parties without your consent. We comply with all relevant privacy laws and regulations to ensure your safety and privacy."
    },
    {
      question: "How do I report inappropriate behavior?",
      answer: "If you encounter any inappropriate behavior, you can report it directly from the user's profile. Click on the three dots menu and select 'Report'. Our moderation team will review the report and take appropriate action."
    },
    {
      question: "How can I delete my account?",
      answer: "You can delete your account by going to Settings > Account > Delete Account. Please note that this action is irreversible and all your data will be permanently removed from our servers."
    },
    {
      question: "What should I do if I forget my password?",
      answer: "Click on the 'Forgot Password' link on the login page. Enter your email address and we'll send you a password reset link. Follow the instructions in the email to create a new password."
    },
    {
      question: "How do Yugal Coins work?",
      answer: "Yugal Coins are our virtual currency that you can use to boost your profile, send gifts, or unlock premium features. You can purchase coins through our 'Buy Coins' page. Different packages offer various discounts."
    }
  ];

  const supportChannels = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "support@yugaldating.com",
      action: "Send Email"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      contact: "+977-9808370638",
      action: "Call Now"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 9AM - 6PM",
      action: "Start Chat"
    }
  ];

  return (
    <Layout>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Yugal Dating App - Support Center | Get Help & Assistance</title>
        <meta name="description" content="Need help with Yugal Dating App? Visit our support center for FAQs, contact information, and assistance with your dating experience. We're here to help!" />
        <meta name="keywords" content="dating app support, yugal help, dating assistance, online dating help, relationship app support" />
        <link rel="canonical" href="https://yugaldating.com/support" />
      </Helmet>

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto md:ml-20 ml-0">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Can We <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Help You?</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're here to assist you with any questions or issues you might have. 
            Browse our FAQ, contact our support team, or explore helpful resources.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/community" 
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition shadow-sm"
            >
              <User className="w-5 h-5" />
              Community
            </Link>
            <Link 
              to="/blogs" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition shadow-md"
            >
              <Heart className="w-5 h-5" />
              Blog & Tips
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
            <div className="text-gray-600">Resolved Cases</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">24h</div>
            <div className="text-gray-600">Average Response</div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("faq")}
              className={`px-5 py-3 font-medium rounded-t-lg transition ${
                activeTab === "faq"
                  ? "text-pink-600 border-b-2 border-pink-600 bg-pink-50"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Frequently Asked Questions
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-5 py-3 font-medium rounded-t-lg transition ${
                activeTab === "contact"
                  ? "text-pink-600 border-b-2 border-pink-600 bg-pink-50"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Contact Us
            </button>
            <button
              onClick={() => setActiveTab("safety")}
              className={`px-5 py-3 font-medium rounded-t-lg transition ${
                activeTab === "safety"
                  ? "text-pink-600 border-b-2 border-pink-600 bg-pink-50"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Safety Guidelines
            </button>
          </div>

          {/* FAQ Content */}
          {activeTab === "faq" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <p className="text-gray-600 mt-2">Find answers to common questions about using Yugal Dating App</p>
              </div>
              <div className="divide-y divide-gray-100">
                {faqItems.map((item, index) => (
                  <div key={index} className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Content */}
          {activeTab === "contact" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Channels</h2>
                  <div className="space-y-6">
                    {supportChannels.map((channel, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg flex items-center justify-center text-pink-600">
                          {channel.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{channel.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{channel.description}</p>
                          <p className="text-gray-800 font-medium">{channel.contact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Office Hours</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  {submitSuccess ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent Successfully!</h3>
                      <p className="text-gray-600">We've received your message and will get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                          placeholder="What is this regarding?"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                          placeholder="Please describe your issue or question in detail..."
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            Sending...
                          </span>
                        ) : (
                          "Send Message"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Safety Guidelines Content */}
          {activeTab === "safety" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Safety Guidelines</h2>
                <p className="text-gray-600 mt-2">Tips to help you stay safe while using Yugal Dating App</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Protect Your Personal Information</h3>
                        <p className="text-gray-600">
                          Never share personal details like your address, workplace, or financial information 
                          with people you meet online until you trust them completely.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Verify Profiles</h3>
                        <p className="text-gray-600">
                          Look for verified badges on profiles and take time to review photos and information. 
                          If something seems off, report the profile to our team.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Take Your Time</h3>
                        <p className="text-gray-600">
                          Don't rush into meeting someone in person. Spend time getting to know them through 
                          the app first before deciding to meet in real life.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Meet in Public Places</h3>
                        <p className="text-gray-600">
                          For your first few meetings, always choose public places like cafes or restaurants. 
                          Let friends or family know where you're going and when you expect to return.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Trust Your Instincts</h3>
                        <p className="text-gray-600">
                          If something feels wrong or uncomfortable, don't ignore your gut feeling. 
                          It's okay to end a conversation or cancel a meeting if you're not comfortable.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Report Suspicious Activity</h3>
                        <p className="text-gray-600">
                          If someone behaves inappropriately, makes you uncomfortable, or asks for money, 
                          report them immediately using the report feature.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Emergency Contacts</h3>
                  <p className="text-gray-600 mb-3">
                    If you're in immediate danger or need emergency assistance:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-pink-600" />
                      <span className="text-gray-800 font-medium">Police: 100</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-pink-600" />
                      <span className="text-gray-800 font-medium">Women Helpline: 114</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-pink-100 text-xl mb-8 max-w-2xl mx-auto">
            Our support team is ready to assist you with any questions or concerns you might have.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:support@yugaldating.com" 
              className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              <Mail className="w-5 h-5" />
              Email Support
            </a>
            <a 
              href="tel:+9779808370638" 
              className="inline-flex items-center gap-2 bg-pink-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-800 transition"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}

// Simple Helmet component for SEO (since react-helmet isn't installed)
function Helmet({ children }) {
  return <>{children}</>;
}

export default Support;