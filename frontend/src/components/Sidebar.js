import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { currentUser } = useAuth();

  const renderLinks = () => {
    switch (currentUser?.role) {
      case "patient":
        return (
          <>
            <Link to="/dashboard/patient" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
              Dashboard
            </Link>
            <Link to="/dashboard/patient/pending-prescriptions" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
              Pending Prescriptions
            </Link>
            <Link to="/dashboard/patient/make-request" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
              Make Request
            </Link>
            <Link to="/dashboard/patient/history" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
              History
            </Link>
          </>
        );
      case "doctor":
        return (
          <>
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
          </>
        );
      case "pharmacy":
        return (
          <>
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
          </>
        );
      case "admin":
        return (
          <>
            <Link to="/admin-dashboard" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
              Admin Dashboard
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">{currentUser?.role.charAt(0).toUpperCase() + currentUser?.role.slice(1)} Panel</h2>
      <nav className="space-y-4">
        {renderLinks()}
      </nav>
    </aside>
  );
};

export default Sidebar;
