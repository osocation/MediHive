import React from "react";
import { db } from "../firebaseConfig"; // Correct import
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const PharmacyDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold">Pharmacy Dashboard</h1>
      <p className="mt-4">Welcome to the Pharmacy Dashboard. Here you can manage prescription fulfillment.</p>
      {/* Add more pharmacy-specific content here */}
    </div>
  );
};

export default PharmacyDashboard;
