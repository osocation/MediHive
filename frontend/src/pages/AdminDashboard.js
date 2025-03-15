import React from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="p-6 flex-1">
        <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users, settings, and more.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
