import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import DoctorStatistics from '../components/DoctorStatistics'; // Import DoctorStatistics

const DoctorRejectedPrescriptions = () => {
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const [rejectedPrescriptions, setRejectedPrescriptions] = useState([]); // State to store rejected prescriptions
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state

  useEffect(() => {
    // Fetch rejected prescriptions for the current doctor
    const fetchRejectedPrescriptions = async () => {
      if (currentUser) {
        try {
          // Query to get rejected prescriptions for the current doctor
          const q = query(collection(db, "prescriptions"), where("doctorId", "==", currentUser.uid), where("status", "==", "Rejected"));
          const querySnapshot = await getDocs(q);
          const prescriptionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRejectedPrescriptions(prescriptionsData); // Update state with fetched prescriptions
        } catch (error) {
          console.error("Error fetching rejected prescriptions:", error);
          setError("Failed to fetch rejected prescriptions. Please try again later."); // Set error message
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      }
    };

    fetchRejectedPrescriptions();
  }, [currentUser]);

  // Function to update and resubmit prescription
  const handleResubmit = async (prescriptionId) => {
    try {
      const prescriptionRef = doc(db, "prescriptions", prescriptionId);
      await updateDoc(prescriptionRef, { status: "Pending Doctor Approval" });

      setRejectedPrescriptions(rejectedPrescriptions.filter((prescription) => prescription.id !== prescriptionId));
    } catch (error) {
      console.error("Error resubmitting prescription:", error);
      setError("Failed to resubmit prescription. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Rejected Prescriptions</h1>

      {loading ? (
        <p>Loading rejected prescriptions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : rejectedPrescriptions.length === 0 ? (
        <p>No rejected prescriptions.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Patient</th>
                <th className="border p-3">Medication</th>
                <th className="border p-3">Rejection Reason</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rejectedPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="border-t text-center">
                  <td className="border p-3">{prescription.patientName || "Unknown"}</td>
                  <td className="border p-3">{prescription.medication || "N/A"}</td>
                  <td className="border p-3">{prescription.rejectionReason || "No reason provided"}</td>
                  <td className="border p-3">
                    <button
                      onClick={() => handleResubmit(prescription.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                    >
                      Resubmit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DoctorStatistics prescriptions={rejectedPrescriptions} patients={[]} /> {/* Add DoctorStatistics component */}
    </div>
  );
};

export default DoctorRejectedPrescriptions;
