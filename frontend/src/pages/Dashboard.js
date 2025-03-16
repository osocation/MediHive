import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PharmacyDashboard from "./PharmacyDashboard";
import AdminDashboard from "./AdminDashboard";
import PatientSidebar from "../components/PatientSidebar";
import DoctorSidebar from "../components/DoctorSidebar";
import PharmacySidebar from "../components/PharmacySidebar";
import AdminSidebar from "../components/AdminSidebar";

const Dashboard = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const renderSidebar = () => {
    switch (currentUser.role) {
      case "patient":
        return <PatientSidebar />;
      case "doctor":
        return <DoctorSidebar />;
      case "pharmacy":
        return <PharmacySidebar />;
      case "admin":
        return <AdminSidebar />;
      default:
        return null;
    }
  };

  const renderDashboard = () => {
    switch (currentUser.role) {
      case "patient":
        return <PatientDashboard />;
      case "doctor":
        return <DoctorDashboard />;
      case "pharmacy":
        return <PharmacyDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {renderSidebar()}
      <div className="flex-1 p-6 bg-gray-100">
        <Routes>
          <Route path="/*" element={renderDashboard()} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
