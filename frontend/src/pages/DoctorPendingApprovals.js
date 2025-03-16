import React, { useEffect, useState, useCallback } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import DoctorStatistics from '../components/DoctorStatistics'; // Import DoctorStatistics

const DoctorPendingApprovals = () => {
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const [pendingPrescriptions, setPendingPrescriptions] = useState([]); // State to store pending prescriptions
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [processing, setProcessing] = useState(null); // Track button loading state
  const [error, setError] = useState(null); // Add error state

  // Fetch pending prescriptions for the logged-in doctor
  const fetchPendingPrescriptions = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // Query to get pending prescriptions for the current doctor
      const q = query(
        collection(db, "prescriptions"),
        where("doctorId", "==", currentUser.uid),
        where("status", "==", "Pending Doctor Approval")
      );
      const snapshot = await getDocs(q);
      setPendingPrescriptions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setError("Failed to fetch pending prescriptions. Please try again later."); // Set error message
    }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchPendingPrescriptions();
  }, [fetchPendingPrescriptions]);

  // Approve a prescription
  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      // Update prescription status to "Pending Pharmacy Approval"
      await updateDoc(doc(db, "prescriptions", id), { status: "Pending Pharmacy Approval" });
      setPendingPrescriptions((prev) => prev.filter((prescription) => prescription.id !== id));
    } catch (error) {
      console.error("Error approving prescription:", error);
      setError("Failed to approve prescription. Please try again later."); // Set error message
    }
    setProcessing(null);
  };

  // Reject a prescription
  const handleReject = async (id) => {
    setProcessing(id);
    try {
      // Update prescription status to "Rejected by Doctor"
      await updateDoc(doc(db, "prescriptions", id), { status: "Rejected by Doctor" });
      setPendingPrescriptions((prev) => prev.filter((prescription) => prescription.id !== id));
    } catch (error) {
      console.error("Error rejecting prescription:", error);
      setError("Failed to reject prescription. Please try again later."); // Set error message
    }
    setProcessing(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Pending Approvals</h1>

      {loading ? (
        <p>Loading pending prescriptions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p> // Display error message
      ) : pendingPrescriptions.length === 0 ? (
        <p>No pending prescriptions.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Patient</th>
                <th className="border p-3">Medication</th>
                <th className="border p-3">Dosage</th>
                <th className="border p-3">Frequency</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="border-t text-center">
                  <td className="border p-3">{prescription.patientName || "Unknown"}</td>
                  <td className="border p-3">{prescription.medicationName || "Unknown"}</td>
                  <td className="border p-3">{prescription.dosage}</td>
                  <td className="border p-3">{prescription.frequency || "N/A"}</td>
                  <td className="border p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleApprove(prescription.id)}
                      disabled={processing === prescription.id}
                      className={`px-3 py-1 text-white rounded transition ${
                        processing === prescription.id ? "bg-gray-400" : "bg-green-500 hover:bg-green-700"
                      }`}
                    >
                      {processing === prescription.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(prescription.id)}
                      disabled={processing === prescription.id}
                      className={`px-3 py-1 text-white rounded transition ${
                        processing === prescription.id ? "bg-gray-400" : "bg-red-500 hover:bg-red-700"
                      }`}
                    >
                      {processing === prescription.id ? "Processing..." : "Reject"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DoctorStatistics prescriptions={pendingPrescriptions} patients={[]} /> {/* Add DoctorStatistics component */}
    </div>
  );
};

export default DoctorPendingApprovals;
