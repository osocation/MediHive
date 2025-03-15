import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-4">
        <Link to="/admin/dashboard" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Dashboard
        </Link>
        <Link to="/admin/users" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Manage Users
        </Link>
        <Link to="/admin/prescriptions" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Prescriptions
        </Link>
        <Link to="/admin/settings" className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          Settings
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
