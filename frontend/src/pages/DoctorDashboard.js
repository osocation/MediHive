import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import DoctorSidebar from "../components/DoctorSidebar";

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        if (currentUser) {
          const q = query(collection(db, "prescriptions"), where("doctorId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);

          const patientData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPatients(patientData);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [currentUser]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

        <h2 className="text-xl font-semibold mb-4">Your Patients</h2>

        {loading ? (
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
                      <td className="border p-3">{patient.patientName || "N/A"}</td>
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
      </div>
    </div>
  );
};

export default DoctorDashboard;
