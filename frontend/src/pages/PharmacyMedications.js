import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Sidebar from '../components/Sidebar'; // Import the Sidebar component
import PharmacyStatistics from '../components/PharmacyStatistics'; // Import PharmacyStatistics

const PharmacyMedications = () => {
  const { currentUser } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedications = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, "medications"), where("pharmacyId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const medicationsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMedications(medicationsData);
        } catch (error) {
          console.error("Error fetching medications:", error);
          setError("Failed to load medications.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMedications();
  }, [currentUser]);

  return (
    <div className="pharmacy-medications flex">
      <Sidebar /> {/* Include the Sidebar component */}
      <div className="main-content flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Pharmacy Medications</h1>
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
                <p className="mt-2">Quantity: {medication.quantity}</p>
              </div>
            ))}
          </div>
        )}
        <PharmacyStatistics medications={medications} prescriptions={[]} /> {/* Add PharmacyStatistics component */}
      </div>
    </div>
  );
};

export default PharmacyMedications;
