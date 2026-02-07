import React from "react";
import { Helmet } from "react-helmet-async";
import {
  MessageCircle,
  Heart,
  Users,
  ShieldCheck,
  Bell,
  Search
} from "lucide-react";

function FeaturesYugal() {
  const features = [
    {
      icon: Heart,
      title: "Smart Matching",
      description: "Our intelligent algorithm helps you find like-minded people who share your interests and passions.",
    },
    {
      icon: Users,
      title: "Verified Profiles",
      description: "All users are verified for authenticity to ensure real connections without fake accounts.",
    },
    {
      icon: MessageCircle,
      title: "Instant Chat",
      description: "Send and receive messages instantly, making it easier to connect with new people.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy & Security",
      description: "We prioritize your safety with encrypted chats and full control over your personal information.",
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Stay updated with instant notifications for messages, matches, and events.",
    },
    {
      icon: Search,
      title: "Discover People Nearby",
      description: "Find users nearby or across Nepal based on your preferences and interests.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Features | YugalMeet</title>
        <meta
          name="description"
          content="Explore the key features of YugalMeet. Verified profiles, smart matching, instant chat, privacy, and more."
        />
        <link rel="canonical" href="https://www.yugalmeet.com/features" />
      </Helmet>

      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">

          {/* Hero */}
          <section className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Features of <span className="text-pink-500">YugalMeet</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Explore what makes YugalMeet the most trusted dating platform in Nepal.
            </p>
          </section>

          {/* Features Grid */}
          <section className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition flex flex-col items-center text-center"
              >
                <feature.icon size={40} className="text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </section>

          {/* CTA */}
          <section className="mt-24 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join?</h2>
            <p className="text-gray-600 mb-8">
              Start connecting with like-minded people in Nepal today!
            </p>
            <a
              href="/download"
              className="inline-flex items-center gap-2 px-8 py-4 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition shadow"
            >
              <Heart size={16} />
              Download YugalMeet
            </a>
          </section>

        </div>
      </main>
    </>
  );
}

export default FeaturesYugal;
