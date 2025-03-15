import React, { useEffect, useState, useCallback } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const AvailableMedications = () => {
  const { currentUser } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Use useCallback to prevent unnecessary re-renders
  const fetchMedications = useCallback(async () => {
    if (!currentUser) return; // ✅ Prevent running if user is null
    setLoading(true);
    try {
      const q = query(collection(db, "medications"), where("pharmacyId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      setMedications(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
    setLoading(false);
  }, [currentUser]); // ✅ Added currentUser to dependencies

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications, currentUser]); // ✅ Now we include currentUser

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Medications</h1>
      {loading ? (
        <p>Loading medications...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Name</th>
                <th className="border p-3">Dosage</th>
                <th className="border p-3">Form</th>
                <th className="border p-3">Manufacturer</th>
                <th className="border p-3">Stock</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med) => (
                <tr key={med.id} className="border-t text-center">
                  <td className="border p-3">{med.name}</td>
                  <td className="border p-3">{med.dosage}</td>
                  <td className="border p-3">{med.form}</td>
                  <td className="border p-3">{med.manufacturer}</td>
                  <td className="border p-3">{med.amountAvailable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AvailableMedications;
