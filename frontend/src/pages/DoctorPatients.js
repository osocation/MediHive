import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const DoctorPatients = () => {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        if (currentUser) {
          const q = query(collection(db, "users"), where("assignedDoctorId", "==", currentUser.uid), where("role", "==", "patient"));
          const querySnapshot = await getDocs(q);
          const patientsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setPatients(patientsData);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [currentUser]);

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
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition">
                      View Profile
                    </button>
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
