import React, { useEffect, useState, useCallback } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const DoctorApprovedPrescriptions = () => {
  const { currentUser } = useAuth();
  const [approvedPrescriptions, setApprovedPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Memoized function using useCallback
  const fetchApprovedPrescriptions = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "prescriptions"),
        where("doctorId", "==", currentUser.uid),
        where("status", "==", "Approved")
      );
      const snapshot = await getDocs(q);
      setApprovedPrescriptions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching approved prescriptions:", error);
    }
    setLoading(false);
  }, [currentUser]);

  // ✅ useEffect now correctly depends on fetchApprovedPrescriptions
  useEffect(() => {
    fetchApprovedPrescriptions();
  }, [fetchApprovedPrescriptions]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Approved Prescriptions</h1>

      {loading ? (
        <p>Loading approved prescriptions...</p>
      ) : approvedPrescriptions.length === 0 ? (
        <p>No approved prescriptions.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Patient Name</th>
                <th className="border p-3">Medication</th>
                <th className="border p-3">Dosage</th>
                <th className="border p-3">Frequency</th>
                <th className="border p-3">Pharmacy Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="border-t text-center">
                  <td className="border p-3">{prescription.patientName || "N/A"}</td>
                  <td className="border p-3">{prescription.medication || "N/A"}</td>
                  <td className="border p-3">{prescription.dosage || "N/A"}</td>
                  <td className="border p-3">{prescription.frequency || "N/A"}</td>
                  <td className="border p-3">{prescription.pharmacyStatus || "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorApprovedPrescriptions;
