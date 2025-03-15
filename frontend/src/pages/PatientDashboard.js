import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Correct import
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (currentUser) {
        const q = query(collection(db, "prescriptions"), where("patientId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        setPrescriptions(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    };
    fetchPrescriptions();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold">Patient Dashboard</h1>
      <h2 className="text-xl mt-4">Your Prescriptions</h2>
      <ul className="mt-4">
        {prescriptions.map((prescription) => (
          <li key={prescription.id} className="p-4 bg-white shadow-md rounded-lg mb-4">
            <strong>{prescription.medication}</strong> - {prescription.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientDashboard;
