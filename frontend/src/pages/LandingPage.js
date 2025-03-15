import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-400 flex flex-col items-center justify-center text-center p-6">
      
      {/* Hero Section */}
      <div className="max-w-3xl bg-white shadow-2xl p-10 rounded-3xl transform transition hover:scale-105">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-6">
          Welcome to MediHive
        </h1>
        <p className="text-gray-700 text-xl mb-4">
          Facilitating secure electronic prescription issuance, verification, and fulfillment.
        </p>
        <p className="text-gray-600">
          Doctors can issue digitally signed prescriptions. Patients can choose pharmacies for medication retrieval. Pharmacies ensure secure dispensing and avoid duplicate purchases.
        </p>
      </div>

      {/* User Role Selection */}
      <div className="mt-10 flex flex-wrap justify-center gap-8">
        <RoleCard 
          title="For Doctors" 
          description="Issue prescriptions with digital signatures and manage patient records securely." 
          buttonText="Register as Doctor" 
          link="/register?role=doctor"
        />
        <RoleCard 
          title="For Patients" 
          description="Track prescriptions, select pharmacies, and ensure timely medication retrieval." 
          buttonText="Register as Patient" 
          link="/register?role=patient"
        />
        <RoleCard 
          title="For Pharmacies" 
          description="Verify prescriptions, dispense medicines, and avoid duplicate retrievals." 
          buttonText="Register as Pharmacy" 
          link="/register?role=pharmacy"
        />
      </div>

      {/* Instructions Section */}
      <div className="mt-12 bg-blue-50 p-6 rounded-lg shadow-lg max-w-4xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          How MediHive Works
        </h2>
        <ul className="list-disc list-inside text-left text-gray-700">
          <li>Doctors can generate, sign, and manage prescriptions securely.</li>
          <li>Patients receive prescriptions and select their preferred pharmacies.</li>
          <li>Pharmacies verify prescriptions to prevent duplicate purchases.</li>
          <li>The platform enforces prescription due dates and medication limits for long-term treatments.</li>
        </ul>
      </div>

      {/* Login/Register Links */}
      <div className="mt-8">
        <p className="text-gray-800">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-800 font-bold underline hover:text-blue-600 transition">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

// Reusable Role Card Component
const RoleCard = ({ title, description, buttonText, link }) => {
  return (
    <div className="bg-white shadow-lg p-8 rounded-2xl w-80 text-center transform transition hover:scale-105 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
      <p className="text-gray-600 mt-3">{description}</p>
      <Link to={link} className="mt-5 inline-block bg-blue-700 text-white px-5 py-3 rounded-full hover:bg-blue-800 transition">
        {buttonText}
      </Link>
    </div>
  );
};

export default LandingPage;
