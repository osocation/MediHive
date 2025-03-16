import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header"; // Import the Header component

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Header /> {/* Include the Header component */}
      <div className="flex flex-1">
        <main className="flex-1 p-6"> {/* Remove the conditional margin */}
          <Outlet /> {/* This will dynamically load the current page */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
