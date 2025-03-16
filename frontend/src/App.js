import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard"; // Import DoctorDashboard
import DoctorApprovedPrescriptions from "./pages/DoctorApprovedPrescriptions";
import CreatePrescription from "./pages/CreatePrescription"; // Import CreatePrescription
import PendingApprovals from "./pages/PendingApprovals"; // Fix the import statement
import RejectedPrescriptions from "./pages/RejectedPrescriptions";
import DoctorPatients from "./pages/DoctorPatients"; // Import DoctorPatients
import PatientMedicalHistory from "./pages/PatientMedicalHistory";
import ApprovePrescription from "./pages/ApprovePrescription";
import AvailableMedications from "./pages/AvailableMedications";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";
import AdminDashboard from "./pages/AdminDashboard";
import MakeRequest from "./components/MakeRequest"; // Import the MakeRequest component
import DoctorList from "./components/DoctorList"; // Import the DoctorList component
import History from "./components/History"; // Import the History component
import PendingPrescriptions from "./components/PendingPrescriptions"; // Import the PendingPrescriptions component
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Sidebar from "./components/Sidebar"; // Import the Sidebar component

const RoleBasedRedirect = () => {
  const { currentUser } = useAuth();

  if (currentUser?.role === "patient") return <Navigate to="/dashboard/patient" />;
  if (currentUser?.role === "doctor") return <Navigate to="/dashboard/doctor" />; // Redirect to DoctorDashboard
  if (currentUser?.role === "pharmacy") return <Navigate to="/dashboard/pharmacy" />;
  if (currentUser?.role === "admin") return <Navigate to="/admin-dashboard" />;
  
  return <Navigate to="/login" />;
};

const App = () => {
  const { currentUser } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<MainLayout />}>
            <Route index element={currentUser ? <RoleBasedRedirect /> : <LandingPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="dashboard" element={<RoleBasedRedirect />} />
            <Route path="dashboard/patient/*" element={
              <div className="patient-dashboard flex">
                <Sidebar /> {/* Use the Sidebar component */}
                <div className="main-content flex-1 p-6 bg-gray-100">
                  <Routes>
                    <Route index element={<PatientDashboard />} /> {/* Ensure PatientDashboard is at the Dashboard route */}
                    <Route path="history" element={<History />} /> {/* Fix the History route */}
                    <Route path="make-request" element={<MakeRequest />} /> {/* Fix the Make Request route */}
                    <Route path="choose-doctors" element={<DoctorList />} /> {/* Fix the Choose Doctors route */}
                    <Route path="pending-prescriptions" element={<PendingPrescriptions />} /> {/* Ensure PendingPrescriptions displays all prescriptions */}
                  </Routes>
                </div>
              </div>
            } />
            <Route path="dashboard/doctor/*" element={
              <div className="doctor-dashboard flex">
                <Sidebar /> {/* Use the Sidebar component */}
                <div className="main-content flex-1 p-6 bg-gray-100">
                  <Routes>
                    <Route index element={<DoctorDashboard />} /> {/* Ensure DoctorDashboard is at the Dashboard route */}
                    <Route path="create-prescription" element={<CreatePrescription />} /> {/* Ensure CreatePrescription is at the correct route */}
                    <Route path="pending-approvals" element={<PendingApprovals />} />
                    <Route path="approved-prescriptions" element={<DoctorApprovedPrescriptions />} />
                    <Route path="rejected-prescriptions" element={<RejectedPrescriptions />} />
                    <Route path="patients" element={<DoctorPatients />} /> {/* Ensure DoctorPatients displays all assigned patients */}
                    <Route path="medical-history" element={<PatientMedicalHistory />} />
                  </Routes>
                </div>
              </div>
            } />
            <Route path="dashboard/pharmacy/*" element={
              <div className="pharmacy-dashboard flex">
                <Sidebar /> {/* Use the Sidebar component */}
                <div className="main-content flex-1 p-6 bg-gray-100">
                  <Routes>
                    <Route index element={<AvailableMedications />} />
                    <Route path="medications" element={<Medications />} />
                    <Route path="add-medication" element={<AddMedication />} />
                    <Route path="review-prescriptions" element={<ApprovePrescription />} />
                  </Routes>
                </div>
              </div>
            } />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<LandingPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
