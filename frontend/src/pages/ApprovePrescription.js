import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

// Component to approve or reject prescription requests
const ApprovePrescription = () => {
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const [prescriptions, setPrescriptions] = useState([]); // State to store prescriptions
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state

  // Fetch prescriptions when the component mounts or when currentUser changes
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (currentUser) {
        try {
          // Query to fetch prescriptions with status "Pending Pharmacy Approval"
          const q = query(collection(db, "prescriptions"), where("status", "==", "Pending Pharmacy Approval"));
          const querySnapshot = await getDocs(q);
          const prescriptionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPrescriptions(prescriptionsData); // Set the fetched prescriptions to state
        } catch (error) {
          console.error("Error fetching prescriptions:", error);
          setError("Failed to fetch prescriptions. Please try again later."); // Set error state if fetching fails
        } finally {
          setLoading(false); // Set loading state to false after fetching
        }
      }
    };

    fetchPrescriptions();
  }, [currentUser]);

  // Function to handle approval of a prescription
  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "prescriptions", id), { status: "fulfilled" }); // Update prescription status to "fulfilled"
      setPrescriptions((prev) => prev.filter((prescription) => prescription.id !== id)); // Remove the approved prescription from state
    } catch (error) {
      console.error("Error approving prescription:", error);
      setError("Failed to approve prescription. Please try again later."); // Set error state if approval fails
    }
  };

  // Function to handle rejection of a prescription
  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, "prescriptions", id), { status: "rejected" }); // Update prescription status to "rejected"
      setPrescriptions((prev) => prev.filter((prescription) => prescription.id !== id)); // Remove the rejected prescription from state
    } catch (error) {
      console.error("Error rejecting prescription:", error);
      setError("Failed to reject prescription. Please try again later."); // Set error state if rejection fails
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Review Prescription Requests</h1>
      {loading ? (
        <p>Loading prescriptions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : prescriptions.length === 0 ? (
        <p>No pending prescriptions.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Patient Name</th>
                <th className="border p-3">Medication</th>
                <th className="border p-3">Dosage</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription.id} className="border-t text-center">
                  <td className="border p-3">{prescription.patientName}</td>
                  <td className="border p-3">{prescription.medication}</td>
                  <td className="border p-3">{prescription.dosage}</td>
                  <td className="border p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleApprove(prescription.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(prescription.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApprovePrescription;
