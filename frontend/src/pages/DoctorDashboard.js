import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Route, Routes, Link } from 'react-router-dom'; // Import Link
import DoctorSidebar from "../components/DoctorSidebar";
import PatientRequests from '../components/PatientRequests';
import CreatePrescription from '../pages/CreatePrescription';
import PendingApprovals from '../pages/PendingApprovals';
import ApprovedPrescriptions from '../pages/DoctorApprovedPrescriptions';
import RejectedPrescriptions from '../pages/RejectedPrescriptions';
import DoctorPatients from '../pages/DoctorPatients';
import PatientMedicalHistory from '../pages/PatientMedicalHistory';

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPatients = async () => {
      if (currentUser && isMounted) {
        try {
          const q = query(collection(db, "users"), where("assignedDoctorId", "==", currentUser.uid), where("role", "==", "patient"));
          const querySnapshot = await getDocs(q);
          const patientData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (isMounted) setPatients(patientData);
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      }
    };

    const fetchRequests = async () => {
      if (currentUser && isMounted) {
        try {
          const q = query(collection(db, "requests"), where("doctorId", "==", currentUser.uid), where("status", "==", "Pending"));
          const querySnapshot = await getDocs(q);
          const requestsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (isMounted) setRequests(requestsData);
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      }
    };

    const fetchPrescriptions = async () => {
      if (currentUser && isMounted) {
        try {
          const q = query(collection(db, "prescriptions"), where("doctorId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const prescriptionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (isMounted) setPrescriptions(prescriptionsData);
        } catch (error) {
          console.error("Error fetching prescriptions:", error);
        }
      }
    };

    fetchPatients();
    fetchRequests();
    fetchPrescriptions();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const totalPrescriptions = prescriptions.length;
  const pendingApprovals = prescriptions.filter(prescription => prescription.status === "Pending").length;
  const completedPrescriptions = prescriptions.filter(prescription => prescription.status === "Completed").length;

  return (
    <div className="doctor-dashboard flex">
      <DoctorSidebar />
      <div className="main-content flex-1 p-6 bg-gray-100">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow-md rounded-lg p-4">
                  <h2 className="text-xl font-semibold">Total Prescriptions</h2>
                  <p className="text-2xl">{totalPrescriptions}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <h2 className="text-xl font-semibold">Pending Approvals</h2>
                  <p className="text-2xl">{pendingApprovals}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <h2 className="text-xl font-semibold">Completed Prescriptions</h2>
                  <p className="text-2xl">{completedPrescriptions}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Link to="/dashboard/doctor/create-prescription" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                  Create Prescription
                </Link>
                <Link to="/dashboard/doctor/pending-approvals" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                  Pending Approvals
                </Link>
                <Link to="/dashboard/doctor/approved-prescriptions" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                  Approved Prescriptions
                </Link>
                <Link to="/dashboard/doctor/rejected-prescriptions" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                  Rejected Prescriptions
                </Link>
                <Link to="/dashboard/doctor/patients" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                  Patient List
                </Link>
                <Link to="/dashboard/doctor/medical-history" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                  Medical History
                </Link>
              </div>
              <h2 className="text-xl font-semibold mb-4">Your Patients</h2>
              {patients.length === 0 ? (
                <p>Loading patients...</p>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-4">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-3">Patient Name</th>
                        <th className="border p-3">Prescription</th>
                        <th className="border p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.length > 0 ? (
                        patients.map((patient) => (
                          <tr key={patient.id} className="border-t text-center">
                            <td className="border p-3">{patient.name || "N/A"}</td>
                            <td className="border p-3">{patient.medication || "N/A"}</td>
                            <td className="border p-3">{patient.status || "Pending"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="p-4 text-center">
                            No patients assigned yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          } />
          <Route path="patient-requests" element={<PatientRequests requests={requests} />} />
          <Route path="create-prescription" element={<CreatePrescription />} />
          <Route path="pending-approvals" element={<PendingApprovals />} />
          <Route path="approved-prescriptions" element={<ApprovedPrescriptions />} />
          <Route path="rejected-prescriptions" element={<RejectedPrescriptions />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="medical-history" element={<PatientMedicalHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default DoctorDashboard;
