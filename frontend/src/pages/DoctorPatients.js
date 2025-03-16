import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

// Main component for displaying doctor's patients and requests
const DoctorPatients = () => {
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const [patients, setPatients] = useState([]); // State to store patients
  const [requests, setRequests] = useState([]); // State to store requests
  const [search, setSearch] = useState(""); // State for search input
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state

  // Fetch patients and requests when the component mounts or currentUser changes
  useEffect(() => {
    const fetchPatients = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, "users"), where("assignedDoctors", "array-contains", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const patientsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPatients(patientsData);
        } catch (error) {
          console.error("Error fetching patients:", error);
          setError("Failed to load patients.");
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchRequests = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, "requests"), where("doctorId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const requestsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRequests(requestsData);
        } catch (error) {
          console.error("Error fetching requests:", error);
          setError("Failed to load requests.");
        }
      }
    };

    fetchPatients();
    fetchRequests();
  }, [currentUser]);

  // Filter patients based on search input
  const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My Patients</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Patients"
        className="w-full p-2 mb-4 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading patients...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : patients.length === 0 ? (
        <p>No patients assigned.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Name</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Phone</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-t text-center">
                  <td className="border p-3">{patient.name || "N/A"}</td>
                  <td className="border p-3">{patient.email || "N/A"}</td>
                  <td className="border p-3">{patient.phone || "N/A"}</td>
                  <td className="border p-3">
                    <Link to={`/dashboard/doctor/medical-history/${patient.id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition">
                      View Medical History
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Requests</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Request ID</th>
                <th className="border p-3">Patient ID</th>
                <th className="border p-3">Description</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-t text-center">
                  <td className="border p-3">{request.id}</td>
                  <td className="border p-3">{request.patientId}</td>
                  <td className="border p-3">{request.description}</td>
                  <td className="border p-3">{request.status}</td>
                  <td className="border p-3">
                    <Link to={`/dashboard/doctor/create-prescription/${request.patientId}`} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700 transition">
                      Create Prescription
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
