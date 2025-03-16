import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import DoctorStatistics from '../components/DoctorStatistics'; // Import DoctorStatistics

const DoctorApprovedPrescriptions = () => {
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const [approvedPrescriptions, setApprovedPrescriptions] = useState([]); // State to store approved prescriptions
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state

  useEffect(() => {
    // Fetch approved prescriptions for the current doctor
    const fetchApprovedPrescriptions = async () => {
      if (currentUser) {
        try {
          // Query to get approved prescriptions for the current doctor
          const q = query(collection(db, "prescriptions"), where("doctorId", "==", currentUser.uid), where("status", "==", "Approved"));
          const querySnapshot = await getDocs(q);
          const prescriptionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setApprovedPrescriptions(prescriptionsData); // Update state with fetched prescriptions
        } catch (error) {
          console.error("Error fetching approved prescriptions:", error);
          setError("Failed to fetch approved prescriptions. Please try again later."); // Set error message
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      }
    };

    fetchApprovedPrescriptions();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Approved Prescriptions</h1>
      {loading ? (
        <p>Loading approved prescriptions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : approvedPrescriptions.length === 0 ? (
        <p>No approved prescriptions.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Patient</th>
                <th className="border p-3">Medication</th>
                <th className="border p-3">Dosage</th>
                <th className="border p-3">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {approvedPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="border-t text-center">
                  <td className="border p-3">{prescription.patientName || "Unknown"}</td>
                  <td className="border p-3">{prescription.medicationName || "Unknown"}</td>
                  <td className="border p-3">{prescription.dosage}</td>
                  <td className="border p-3">{prescription.frequency || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DoctorStatistics prescriptions={approvedPrescriptions} patients={[]} /> {/* Add DoctorStatistics component */}
    </div>
  );
};

export default DoctorApprovedPrescriptions;
