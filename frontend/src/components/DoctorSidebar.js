import React from "react";
import { Link } from "react-router-dom";

const DoctorSidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Doctor Panel</h2>
      <nav className="space-y-4">
        <Link to="/dashboard/doctor" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Dashboard
        </Link>
        <Link to="/dashboard/doctor/create-prescription" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Create Prescription
        </Link>
        <Link to="/dashboard/doctor/pending-approvals" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Pending Approvals
        </Link>
        <Link to="/dashboard/doctor/approved-prescriptions" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Approved Prescriptions
        </Link>
        <Link to="/dashboard/doctor/rejected-prescriptions" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Rejected Prescriptions
        </Link>
        <Link to="/dashboard/doctor/patients" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Patient List
        </Link>
        <Link to="/dashboard/doctor/medical-history" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Medical History
        </Link>
      </nav>
    </aside>
  );
};

export default DoctorSidebar;
