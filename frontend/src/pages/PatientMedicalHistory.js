import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";

// Component to display patient's medical history
const PatientMedicalHistory = () => {
  const { patientId } = useParams(); // Get patientId from URL parameters
  const [medicalHistory, setMedicalHistory] = useState([]); // State to store medical history data
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    // Function to fetch medical history from Firestore
    const fetchMedicalHistory = async () => {
      try {
        if (!patientId) return; // If no patientId, return early
        const q = query(collection(db, "medicalHistory"), where("patientId", "==", patientId)); // Query to get medical history for the patient
        const querySnapshot = await getDocs(q); // Execute the query

        // Map through the query results and format the data
        const historyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMedicalHistory(historyData); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching medical history:", error); // Log any errors
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchMedicalHistory(); // Call the function to fetch medical history
  }, [patientId]); // Dependency array to re-run effect when patientId changes

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Medical History</h2>
      {loading ? (
        <p>Loading medical history...</p> // Show loading message while data is being fetched
      ) : (
        <div className="overflow-x-auto">
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
