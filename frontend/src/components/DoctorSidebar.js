import React from "react";
import { Link, useLocation } from "react-router-dom";

const DoctorSidebar = () => {
  const location = useLocation();

  // Sidebar navigation links
  const menuItems = [
    { name: "Dashboard Overview", path: "/dashboard/doctor" },
    { name: "Create Prescription", path: "/dashboard/doctor/create-prescription" },
    { name: "Pending Approvals", path: "/dashboard/doctor/pending-approvals" },
    { name: "Approved Prescriptions", path: "/dashboard/doctor/approved-prescriptions" }, // ✅ Corrected route
    { name: "Patient List", path: "/dashboard/doctor/patients" },
    { name: "Medical History", path: "/dashboard/doctor/medical-history" },
  ];

  return (
    <div className="h-screen w-64 bg-blue-900 text-white fixed top-0 left-0 shadow-lg">
      <div className="p-4 text-2xl font-bold text-center border-b border-gray-700">
        Doctor Panel
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-6 py-3 text-lg hover:bg-blue-700 transition ${
              location.pathname === item.path ? "bg-blue-600 font-semibold border-l-4 border-white" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DoctorSidebar;
