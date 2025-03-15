import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <nav className="mt-5">
        <ul>
          <li className="mb-2">
            <Link to="/admin" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/users" className="block p-2 hover:bg-gray-700 rounded">Manage Users</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
