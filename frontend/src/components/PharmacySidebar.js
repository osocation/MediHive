import React from "react";
import { Link } from "react-router-dom";

const PharmacySidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-blue-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Pharmacy Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard/pharmacy/medications" className="py-2 px-4 rounded bg-blue-700 hover:bg-blue-600 transition">
          Available Medications
        </Link>
        <Link to="/dashboard/pharmacy/add-medication" className="py-2 px-4 rounded bg-blue-700 hover:bg-blue-600 transition">
          Add Medication
        </Link>
        <Link to="/dashboard/pharmacy/review-prescriptions" className="py-2 px-4 rounded bg-blue-700 hover:bg-blue-600 transition">
          Review Prescriptions
        </Link>
      </nav>
    </div>
  );
};

export default PharmacySidebar;
