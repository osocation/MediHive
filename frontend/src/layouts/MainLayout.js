import React from "react";
import Header from "../components/Header"; // Fixing the import path
import { Outlet } from "react-router-dom"; // Ensures proper routing

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="p-6">
        <Outlet /> {/* This will dynamically load the current page */}
      </main>
    </div>
  );
};

export default MainLayout;
