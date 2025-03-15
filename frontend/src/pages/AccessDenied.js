import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-4 text-lg">You do not have permission to view this page.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition">
        Go to Home
      </Link>
    </div>
  );
};

export default AccessDenied;
