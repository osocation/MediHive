import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorApprovedPrescriptions from "./pages/DoctorApprovedPrescriptions";
import CreatePrescription from "./pages/CreatePrescription";
import PendingApprovals from "./pages/PendingApprovals";
import RejectedPrescriptions from "./pages/RejectedPrescriptions";
import DoctorPatients from "./pages/DoctorPatients";
import PatientMedicalHistory from "./pages/PatientMedicalHistory";
import ApprovePrescription from "./pages/ApprovePrescription";
import AvailableMedications from "./pages/AvailableMedications";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DoctorSidebar from "./components/DoctorSidebar";
import PharmacySidebar from "./components/PharmacySidebar";
import MainLayout from "./layouts/MainLayout";

const RoleBasedRedirect = () => {
  const { currentUser } = useAuth();

  if (currentUser?.role === "patient") return <Navigate to="/dashboard/patient" />;
  if (currentUser?.role === "doctor") return <Navigate to="/dashboard/doctor" />;
  if (currentUser?.role === "pharmacy") return <Navigate to="/dashboard/pharmacy" />;
  if (currentUser?.role === "admin") return <Navigate to="/admin-dashboard" />;
  
  return <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="dashboard" element={<RoleBasedRedirect />} />
            <Route path="dashboard/patient/*" element={<PatientDashboard />} />
            <Route path="dashboard/doctor" element={<DoctorSidebar />}>
              <Route index element={<DoctorDashboard />} />
              <Route path="create-prescription" element={<CreatePrescription />} />
              <Route path="approved-prescriptions" element={<DoctorApprovedPrescriptions />} />
              <Route path="pending-approvals" element={<PendingApprovals />} />
              <Route path="rejected-prescriptions" element={<RejectedPrescriptions />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="medical-history" element={<PatientMedicalHistory />} />
            </Route>
            <Route path="dashboard/pharmacy" element={<PharmacySidebar />}>
              <Route index element={<AvailableMedications />} />
              <Route path="medications" element={<Medications />} />
              <Route path="add-medication" element={<AddMedication />} />
              <Route path="review-prescriptions" element={<ApprovePrescription />} />
            </Route>
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<LandingPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
