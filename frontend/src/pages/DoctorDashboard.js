import React from "react";
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

const DoctorDashboard = () => {
  return (
    <div className="doctor-dashboard flex">
      <Sidebar /> {/* Include the Sidebar component */}
      <div className="main-content flex-1 p-6 bg-gray-100">
        {/* Content will be added later */}
      </div>
    </div>
  );
};

export default DoctorDashboard;
