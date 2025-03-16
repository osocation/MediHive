import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const DoctorAllPrescriptions = () => {
  const { currentUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Current user UID:", currentUser?.uid);
    console.log("Current user role:", currentUser?.role);
    const fetchPrescriptions = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, "prescriptions"), where("doctorId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        console.log(snapshot.docs.map(doc => doc.data())); // Debug fetched data
        setPrescriptions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch {
        setError("Failed to load prescriptions.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [currentUser]);

  if (loading) return <p>Loading prescriptions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!prescriptions.length) return <p>No prescriptions found.</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Doctor Prescriptions</h1>
      {prescriptions.map((prescription) => (
        <div key={prescription.id} className="border-b p-2">
          <p>Medication: {prescription.medication}</p>
          <p>Status: {prescription.status}</p>
        </div>
      ))}
    </div>
  );
};

export default DoctorAllPrescriptions;
