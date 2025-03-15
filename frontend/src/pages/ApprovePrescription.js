import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const ApprovePrescription = () => {
  const { currentUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        if (currentUser) {
          const q = query(collection(db, "prescriptions"), where("pharmacyId", "==", currentUser.uid), where("status", "==", "pending"));
          const querySnapshot = await getDocs(q);

          setPrescriptions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [currentUser]);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "prescriptions", id), { status: "approved" });
      setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
    } catch (error) {
      console.error("Error approving prescription:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, "prescriptions", id), { status: "rejected" });
      setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
    } catch (error) {
      console.error("Error rejecting prescription:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Review Prescription Requests</h1>

      {loading ? (
        <p>Loading prescriptions...</p>
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
              {prescriptions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">No pending prescriptions</td>
                </tr>
              ) : (
                prescriptions.map((prescription) => (
                  <tr key={prescription.id} className="border-t text-center">
                    <td className="border p-3">{prescription.patientName}</td>
                    <td className="border p-3">{prescription.medication}</td>
                    <td className="border p-3">{prescription.dosage}</td>
                    <td className="border p-3 flex justify-center gap-2">
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={() => handleApprove(prescription.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        onClick={() => handleReject(prescription.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApprovePrescription;
