import React from "react";
import { Outlet } from "react-router-dom";
import PharmacySidebar from "../components/PharmacySidebar";

const PharmacyDashboard = () => {
  return (
    <div className="flex">
      <PharmacySidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default PharmacyDashboard;
