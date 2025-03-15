import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";

const PatientMedicalHistory = () => {
  const { patientId } = useParams();
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        if (!patientId) return;
        const q = query(collection(db, "medicalHistory"), where("patientId", "==", patientId));
        const querySnapshot = await getDocs(q);

        const historyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMedicalHistory(historyData);
      } catch (error) {
        console.error("Error fetching medical history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [patientId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Patient Medical History</h1>

      {loading ? (
        <p>Loading history...</p>
      ) : medicalHistory.length === 0 ? (
        <p>No medical history found.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Date</th>
                <th className="border p-3">Diagnosis</th>
                <th className="border p-3">Prescription</th>
                <th className="border p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {medicalHistory.map((record) => (
                <tr key={record.id} className="border-t text-center">
                  <td className="border p-3">{record.date || "N/A"}</td>
                  <td className="border p-3">{record.diagnosis || "N/A"}</td>
                  <td className="border p-3">{record.prescription || "N/A"}</td>
                  <td className="border p-3">{record.notes || "No notes"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientMedicalHistory;
