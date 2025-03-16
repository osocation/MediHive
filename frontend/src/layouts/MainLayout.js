import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header"; // Import the Header component

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header /> {/* Include the Header component */}
      <main className="p-6">
        <Outlet /> {/* This will dynamically load the current page */}
      </main>
    </div>
  );
};

export default MainLayout;
