import React from "react";
import { Helmet } from "react-helmet-async";
import { Users, Heart, ShieldCheck, Globe } from "lucide-react";

function AboutYugal() {
  return (
    <>
      <Helmet>
        <title>About YugalMeet | Nepal’s Trusted Dating Platform</title>
        <meta
          name="description"
          content="Learn about YugalMeet, Nepal’s trusted dating platform. Our mission, vision, and values for building meaningful relationships safely."
        />
        <link rel="canonical" href="https://www.yugalmeet.com/about" />
      </Helmet>

      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">

          {/* Hero / Mission */}
          <section className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              About <span className="text-pink-500">YugalMeet</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              YugalMeet is Nepal’s trusted dating platform, helping people connect, build meaningful relationships, and meet like-minded individuals safely and confidently.
            </p>
          </section>

          {/* Mission, Vision, Values */}
          <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Users className="text-pink-500" size={40} />
              <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
              <p className="text-gray-600 text-sm">
                To provide a safe and engaging platform for people in Nepal to meet, connect, and build genuine relationships.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Heart className="text-pink-500" size={40} />
              <h3 className="text-xl font-semibold text-gray-900">Our Vision</h3>
              <p className="text-gray-600 text-sm">
                To become Nepal’s leading dating platform known for authenticity, safety, and meaningful connections.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <ShieldCheck className="text-pink-500" size={40} />
              <h3 className="text-xl font-semibold text-gray-900">Our Values</h3>
              <p className="text-gray-600 text-sm">
                Safety, trust, respect, and inclusivity are at the core of everything we do.
              </p>
            </div>
          </section>

          {/* Team Section */}
          <section className="mt-24 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet the Founder</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <img
                src="https://media.licdn.com/dms/image/v2/D5603AQH2DaHi9Jzxng/profile-displayphoto-scale_200_200/B56Ztla_FfJEAc-/0/1766933135265?e=2147483647&v=beta&t=sr3FgNpGPfpwxnjvw6U4qCk2wzMBdF_Qypafs4Cixfc"
                alt="Abhaya Bikram Shahi"
                className="h-40 w-40 rounded-full shadow-lg object-cover"
              />
              <div className="max-w-md text-left">
                <h3 className="text-xl font-semibold text-gray-900">Abhaya Bikram Shahi</h3>
                <p className="text-gray-600 mt-2">
                  Founder of YugalMeet. Passionate about connecting people and building communities where relationships are genuine and meaningful. With a focus on safety and trust, Abhaya envisions a Nepal where everyone can meet like-minded individuals effortlessly.
                </p>
              </div>
            </div>
          </section>

          {/* Global Reach / Community */}
          <section className="mt-24 text-center">
            <Globe className="text-pink-500 mx-auto" size={50} />
            <h2 className="text-3xl font-bold text-gray-900 mt-4">Join the Community</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              YugalMeet is growing every day. Thousands of singles across Nepal are meeting, connecting, and building meaningful relationships on our platform. Be part of a safe, trusted, and inclusive community.
            </p>
          </section>

        </div>
      </main>
    </>
  );
}

export default AboutYugal;
