import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import ManageUsers from "./pages/ManageUsers";
import MakeRequest from "./components/MakeRequest";
import History from "./components/History";
import PendingPrescriptions from "./components/PendingPrescriptions";
import PrescriptionDetails from './components/PrescriptionDetails';
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import Header from "./components/Header"; // Import Header
import DoctorAllPrescriptions from "./pages/DoctorAllPrescriptions";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* No header for landing, register, login */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Redirect user to their respective dashboard based on role */}
          <Route path="/dashboard/*" element={<RoleBasedRedirect />} />

          {/* Patient routes with Header added */}
          <Route
            path="/dashboard/patient/*"
            element={
              <>
                <Header />
                <div className="patient-dashboard flex">
                  <Sidebar />
                  <div className="main-content flex-1 p-6 bg-gray-100">
                    <Routes>
                      <Route index element={<PatientDashboard />} />
                      <Route
                        path="pending-prescriptions"
                        element={<PendingPrescriptions />}
                      />
                      <Route path="history" element={<History />} />
                      <Route path="make-request" element={<MakeRequest />} />
                      <Route
                        path="prescription/:id"
                        element={<PrescriptionDetails />}
                      />
                    </Routes>
                  </div>
                </div>
              </>
            }
          />

          {/* Doctor routes with Header added */}
          <Route
            path="dashboard/doctor/*"
            element={
              <>
                <Header />
                <div className="doctor-dashboard flex">
                  <Sidebar />
                  <div className="main-content flex-1 p-6 bg-gray-100">
                    <Routes>
                      <Route index element={<DoctorDashboard />} />
                      <Route
                        path="create-prescription"
                        element={<CreatePrescription />}
                      />
                      <Route
                        path="pending-approvals"
                        element={<PendingApprovals />}
                      />
                      <Route
                        path="approved-prescriptions"
                        element={<DoctorApprovedPrescriptions />}
                      />
                      <Route
                        path="rejected-prescriptions"
                        element={<RejectedPrescriptions />}
                      />
                      <Route path="patients" element={<DoctorPatients />} />
                      <Route
                        path="medical-history/:patientId"
                        element={<PatientMedicalHistory />}
                      />
                      <Route path="all-prescriptions" element={<DoctorAllPrescriptions />} />
                    </Routes>
                  </div>
                </div>
              </>
            }
          />

          {/* Pharmacy routes with Header added */}
          <Route
            path="dashboard/pharmacy/*"
            element={
              <>
                <Header />
                <div className="pharmacy-dashboard flex">
                  <Sidebar />
                  <div className="main-content flex-1 p-6 bg-gray-100">
                    <Routes>
                      <Route index element={<AvailableMedications />} />
                      <Route path="medications" element={<Medications />} />
                      <Route path="add-medication" element={<AddMedication />} />
                      <Route
                        path="review-prescriptions"
                        element={<ApprovePrescription />}
                      />
                    </Routes>
                  </div>
                </div>
              </>
            }
          />

          {/* Admin routes with Header added */}
          <Route
            path="dashboard/admin/*"
            element={
              <>
                <Header />
                <div className="admin-dashboard flex">
                  <Sidebar />
                  <div className="main-content flex-1 p-6 bg-gray-100">
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="manage-users" element={<ManageUsers />} />
                    </Routes>
                  </div>
                </div>
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
