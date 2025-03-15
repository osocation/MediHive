import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorApprovedPrescriptions from "./pages/DoctorApprovedPrescriptions";
import PendingApprovals from "./pages/PendingApprovals";
import RejectedPrescriptions from "./pages/RejectedPrescriptions";
import DoctorPatients from "./pages/DoctorPatients";
import PatientMedicalHistory from "./pages/PatientMedicalHistory";
import ApprovePrescription from "./pages/ApprovePrescription";
import AvailableMedications from "./pages/AvailableMedications";
import AddMedication from "./pages/AddMedication";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DoctorSidebar from "./components/DoctorSidebar";
import PharmacySidebar from "./components/PharmacySidebar";

const RoleBasedRedirect = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (currentUser.role === "admin") return <Navigate to="/admin-dashboard" />;
  if (currentUser.role === "doctor") return <Navigate to="/dashboard/doctor" />;
  if (currentUser.role === "pharmacy") return <Navigate to="/dashboard/pharmacy" />;
  return <Navigate to="/dashboard/patient" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<RoleBasedRedirect />} />

          {/* ✅ Patient Dashboard */}
          <Route path="/dashboard/patient" element={<PatientDashboard />} />

          {/* ✅ Doctor Dashboard with Sidebar */}
          <Route path="/dashboard/doctor" element={<DoctorSidebar />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="approved-prescriptions" element={<DoctorApprovedPrescriptions />} />
            <Route path="pending-approvals" element={<PendingApprovals />} />
            <Route path="rejected-prescriptions" element={<RejectedPrescriptions />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="medical-history" element={<PatientMedicalHistory />} />
          </Route>

          {/* ✅ Pharmacy Dashboard with Sidebar */}
          <Route path="/dashboard/pharmacy" element={<PharmacySidebar />}>
            <Route index element={<AvailableMedications />} />
            <Route path="medications" element={<AvailableMedications />} />
            <Route path="add-medication" element={<AddMedication />} />
            <Route path="review-prescriptions" element={<ApprovePrescription />} />
          </Route>

          {/* ✅ Admin Dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* 🔄 Fallback Route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
