import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "medications"));
        const medicationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMedications(medicationsData);
      } catch (error) {
        console.error("Error fetching medications:", error);
        setError("Failed to fetch medications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Medications</h1>
      {loading ? (
        <p>Loading medications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : medications.length === 0 ? (
        <p>No medications available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medications.map((medication) => (
            <div key={medication.id} className="p-4 bg-white shadow-md rounded-lg">
              <h3 className="text-lg font-bold">{medication.name}</h3>
              <p className="mt-2">Dosage: {medication.dosage}</p>
              <p className="mt-2">Price: ${medication.price}</p>
              <p className="mt-2">Status: {medication.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Medications;
