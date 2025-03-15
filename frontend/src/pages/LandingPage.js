import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <header className="h-screen flex flex-col justify-center items-center bg-[url('/background.webp')] bg-cover bg-center text-white text-center px-4">
        <h1 className="text-5xl font-bold drop-shadow-lg">Secure Digital Prescriptions</h1>
        <p className="mt-4 text-lg max-w-2xl">
          Effortlessly manage prescriptions for doctors, patients, and pharmacies with our secure and efficient digital system.
        </p>
        <Link to="/register" className="mt-6 px-6 py-3 bg-blue-600 rounded-lg text-white font-semibold shadow-lg hover:bg-blue-700 transition">
          Get Started
        </Link>
      </header>

      {/* How It Works */}
      <section className="py-16 px-8 text-center bg-white">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="p-6 shadow-md bg-white rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">For Doctors</h3>
            <p className="mt-2">Create and digitally sign prescriptions for your patients.</p>
          </div>
          <div className="p-6 shadow-md bg-white rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">For Patients</h3>
            <p className="mt-2">Receive your prescription and select a pharmacy for pickup.</p>
          </div>
          <div className="p-6 shadow-md bg-white rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">For Pharmacies</h3>
            <p className="mt-2">Verify and dispense prescribed medication securely.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-100 py-16 px-8 text-center">
        <h2 className="text-3xl font-bold">What Our Users Say</h2>
        <p className="mt-4 italic max-w-2xl mx-auto">
          "This system has revolutionized the way I manage prescriptions, making my workflow seamless and efficient." - Dr. Jane Doe
        </p>
      </section>

      {/* FAQs */}
      <section className="py-16 px-8 text-center bg-white">
        <h2 className="text-3xl font-bold">FAQs</h2>
        <p className="mt-4">
          Have questions?{" "}
          <Link to="/contact" className="text-blue-600 underline hover:text-blue-800">
            Contact us
          </Link>
          .
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
