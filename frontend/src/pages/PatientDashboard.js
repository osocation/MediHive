import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, "prescriptions"), where("patientId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const prescriptionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPrescriptions(prescriptionsData);
        } catch (error) {
          console.error("Error fetching prescriptions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPrescriptions();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>

      {/* Prescription List */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Prescriptions</h2>
        {loading ? (
          <p>Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="p-4 bg-white shadow-md rounded-lg">
                <h3 className="text-lg font-bold">{prescription.medication}</h3>
                <p className="mt-2">Doctor: {prescription.doctorName}</p>
                <p className="mt-2">Status: <span className={`font-semibold ${prescription.status === "Ready for Pickup" ? "text-green-600" : "text-yellow-600"}`}>{prescription.status}</span></p>
                <p className="mt-2">Date Issued: {new Date(prescription.issuedAt.toDate()).toLocaleDateString()}</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Medical History */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Medical History</h2>
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-bold">Recent Visits</h3>
          <ul className="mt-2">
            <li className="mb-2">Visit Date: 01/01/2025 - Dr. John Smith - Checkup</li>
            <li className="mb-2">Visit Date: 12/15/2024 - Dr. Jane Doe - Flu Symptoms</li>
          </ul>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-bold">Recent Notifications</h3>
          <ul className="mt-2">
            <li className="mb-2">Your prescription #12345 is ready for pickup.</li>
            <li className="mb-2">Reminder: Your next appointment is on 01/15/2025.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard;
