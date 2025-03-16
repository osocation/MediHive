import React from "react";
import { Link } from "react-router-dom";

const PatientSidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Patient Panel</h2>
      <nav className="space-y-4">
        <Link to="/dashboard/patient" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Dashboard
        </Link>
        <Link to="/dashboard/patient/choose-doctors" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Choose Doctors
        </Link>
        <Link to="/dashboard/patient/pending-prescriptions" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Pending Prescriptions
        </Link>
        <Link to="/dashboard/patient/history" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          History
        </Link>
        <Link to="/dashboard/patient/make-request" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Make Request
        </Link>
      </nav>
    </aside>
  );
};

export default PatientSidebar;
