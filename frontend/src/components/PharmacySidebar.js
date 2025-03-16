import React from "react";
import { Link } from "react-router-dom";

const PharmacySidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Pharmacy Panel</h2>
      <nav className="space-y-4">
        <Link to="/dashboard/pharmacy" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Dashboard
        </Link>
        <Link to="/dashboard/pharmacy/medications" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Medications
        </Link>
        <Link to="/dashboard/pharmacy/add-medication" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Add Medication
        </Link>
        <Link to="/dashboard/pharmacy/review-prescriptions" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Review Prescriptions
        </Link>
      </nav>
    </aside>
  );
};

export default PharmacySidebar;
