import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const ApprovePrescription = () => {
  const { currentUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, "prescriptions"), where("status", "==", "Pending Pharmacy Approval"));
          const querySnapshot = await getDocs(q);
          const prescriptionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPrescriptions(prescriptionsData);
        } catch (error) {
          console.error("Error fetching prescriptions:", error);
          setError("Failed to fetch prescriptions. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPrescriptions();
  }, [currentUser]);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "prescriptions", id), { status: "fulfilled" });
      setPrescriptions((prev) => prev.filter((prescription) => prescription.id !== id));
    } catch (error) {
      console.error("Error approving prescription:", error);
      setError("Failed to approve prescription. Please try again later.");
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, "prescriptions", id), { status: "rejected" });
      setPrescriptions((prev) => prev.filter((prescription) => prescription.id !== id));
    } catch (error) {
      console.error("Error rejecting prescription:", error);
      setError("Failed to reject prescription. Please try again later.");
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
