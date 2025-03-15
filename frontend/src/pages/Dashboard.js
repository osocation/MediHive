import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PharmacyDashboard from "./PharmacyDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

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

export default Dashboard;
