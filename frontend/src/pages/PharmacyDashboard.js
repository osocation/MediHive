import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Sidebar from '../components/Sidebar'; // Import the Sidebar component
import PharmacyStatistics from '../components/PharmacyStatistics'; // Import PharmacyStatistics

const PharmacyDashboard = () => {
  const { currentUser } = useAuth();
  const [medications, setMedications] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
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
        }
      }
    };

    const fetchPrescriptions = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, "prescriptions"), where("pharmacyId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const prescriptionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPrescriptions(prescriptionsData);
        } catch (error) {
          console.error("Error fetching prescriptions:", error);
          setError("Failed to load prescriptions.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMedications();
    fetchPrescriptions();
  }, [currentUser]);

  return (
    <div className="pharmacy-dashboard flex">
      <Sidebar /> {/* Include the Sidebar component */}
      <div className="main-content flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Pharmacy Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold">Total Medications</h2>
                <p className="text-2xl">{medications.length}</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold">Total Prescriptions</h2>
                <p className="text-2xl">{prescriptions.length}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Link to="/dashboard/pharmacy/medications" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                Medications
              </Link>
              <Link to="/dashboard/pharmacy/add-medication" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                Add Medication
              </Link>
              <Link to="/dashboard/pharmacy/review-prescriptions" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                Review Prescriptions
              </Link>
            </div>
            <PharmacyStatistics medications={medications} prescriptions={prescriptions} /> {/* Add PharmacyStatistics component */}
          </>
        )}
      </div>
    </div>
  );
};

export default PharmacyDashboard;
