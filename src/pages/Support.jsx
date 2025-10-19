// src/pages/Support.jsx
import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

function Support() {
  return (
    <Layout>
      <div className="pt-24 px-6 pb-10 font-sans max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Support Center</h1>
          <p className="text-gray-600 text-lg mb-6">
            Lyang Na Gar banaudai xu dherai lyang lyang garis bhane talai banaunu prla hai hos gar!!
          </p>

          {/* Community CTA */}
          <Link
            to="/community"
            className="inline-block bg-pink-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow hover:bg-pink-600 transition transform hover:-translate-y-1"
          >
            Join Our Community
          </Link>
        </section>

        {/* Optional: Add more support info here */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Need Help?</h2>
          <p className="text-gray-600">
            Browse our FAQ, reach out to our support team, or join the community to get assistance from other users.
          </p>
        </section>
      </div>
    </Layout>
  );
}

export default Support;
