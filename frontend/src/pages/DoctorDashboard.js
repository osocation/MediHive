import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import DoctorStatistics from '../components/DoctorStatistics'; // Import DoctorStatistics

const DoctorDashboard = () => {
  const { currentUser } = useAuth(); // Get the current user from the AuthContext
  const [patients, setPatients] = useState([]); // State to store patients data
  const [prescriptions, setPrescriptions] = useState([]); // State to store prescriptions data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state

  useEffect(() => {
    // Function to fetch patients assigned to the current doctor
    const fetchPatients = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, "users"), where("assignedDoctors", "array-contains", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const patientsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPatients(patientsData);
        } catch (error) {
          console.error("Error fetching patients:", error);
          setError("Failed to load patients.");
        }
      }
    };

    // Function to fetch prescriptions created by the current doctor
    const fetchPrescriptions = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, "prescriptions"), where("doctorId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const prescriptionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPrescriptions(prescriptionsData);
        } catch (error) {
          console.error("Error fetching prescriptions:", error);
          setError("Failed to load prescriptions.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatients();
    fetchPrescriptions();
  }, [currentUser]);

  return (
    <div className="doctor-dashboard flex">
      <div className="main-content flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold">Total Patients</h2>
                <p className="text-2xl">{patients.length}</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold">Total Prescriptions</h2>
                <p className="text-2xl">{prescriptions.length}</p>
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
            <DoctorStatistics prescriptions={prescriptions} patients={patients} /> {/* Add DoctorStatistics component */}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
