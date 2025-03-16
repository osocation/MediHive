import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Route, Routes, Link } from 'react-router-dom'; // Import Link
import PendingPrescriptions from '../components/PendingPrescriptions';
import History from '../components/History';
import PrescriptionDetails from '../components/PrescriptionDetails';
import MakeRequest from '../components/MakeRequest';
import PatientStatistics from '../components/PatientStatistics'; // Import PatientStatistics

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Fetch prescriptions for the current patient
    const fetchPrescriptions = async () => {
      if (currentUser && isMounted) {
        try {
          const q = query(collection(db, "prescriptions"), where("patientId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const prescriptionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (isMounted) setPrescriptions(prescriptionsData);
        } catch (error) {
          console.error("Error fetching prescriptions:", error);
          setError("Failed to load prescriptions.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPrescriptions();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;

    // Fetch requests for the current patient
    const fetchRequests = async () => {
      if (currentUser && isMounted) {
        try {
          const q = query(collection(db, "requests"), where("patientId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const requestsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (isMounted) setRequests(requestsData);
        } catch (error) {
          console.error("Error fetching requests:", error);
          setError("Failed to load requests.");
        }
      }
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;

    // Fetch available doctors
    const fetchAvailableDoctors = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "doctor"));
        const querySnapshot = await getDocs(q);
        const doctorsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (isMounted) setAvailableDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load available doctors.");
      }
    };

    fetchAvailableDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Fetch assigned doctors for the current patient
    const fetchAssignedDoctors = async () => {
      if (currentUser && isMounted) {
        try {
          const patientRef = doc(db, "users", currentUser.uid);
          const patientDoc = await getDoc(patientRef);
          const assignedDoctorIds = patientDoc.data().assignedDoctors || [];
          const assignedDoctorsData = await Promise.all(
            assignedDoctorIds.map(async (doctorId) => {
              const doctorRef = doc(db, "users", doctorId);
              const doctorDoc = await getDoc(doctorRef);
              return { id: doctorDoc.id, ...doctorDoc.data() };
            })
          );
          if (isMounted) setDoctors(assignedDoctorsData);
        } catch (error) {
          console.error("Error fetching assigned doctors:", error);
          setError("Failed to load assigned doctors.");
        }
      }
    };

    fetchAssignedDoctors();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleSelectDoctor = (event) => {
    const doctorId = event.target.value;
    const doctor = availableDoctors.find(doc => doc.id === doctorId);
    setSelectedDoctor(doctor);
  };

  const handleAddDoctor = async () => {
    if (selectedDoctor) {
      setDoctors([...doctors, selectedDoctor]);
      const patientRef = doc(db, "users", currentUser.uid);
      await updateDoc(patientRef, {
        assignedDoctors: arrayUnion(selectedDoctor.id)
      });
      setSelectedDoctor(null); // Reset the selected doctor
    }
  };

  const handleRemoveDoctor = async (doctorId) => {
    setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    const patientRef = doc(db, "users", currentUser.uid);
    await updateDoc(patientRef, {
      assignedDoctors: arrayRemove(doctorId)
    });
  };

  const filteredAvailableDoctors = availableDoctors.filter(
    (doctor) => !doctors.some((assignedDoctor) => assignedDoctor.id === doctor.id)
  );

  return (
    <div className="patient-dashboard flex">
      <div className="main-content flex-1 p-6 bg-gray-100">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <Routes>
            <Route path="/" element={
              <>
                <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold">Total Prescriptions</h2>
                    <p className="text-2xl">{prescriptions.length}</p>
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold">Pending Requests</h2>
                    <p className="text-2xl">{requests.length}</p>
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold">Assigned Doctors</h2>
                    <p className="text-2xl">{doctors.length}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Link to="/dashboard/patient/pending-prescriptions" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                    Pending Prescriptions
                  </Link>
                  <Link to="/dashboard/patient/history" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                    History
                  </Link>
                  <Link to="/dashboard/patient/make-request" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                    Make Request
                  </Link>
                </div>
                <h2 className="text-xl font-semibold mb-4">Your Doctors</h2>
                {doctors.length === 0 ? (
                  <p>Loading doctors...</p>
                ) : (
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-3">Doctor Name</th>
                          <th className="border p-3">Specialization</th>
                          <th className="border p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctors.length > 0 ? (
                          doctors.map((doctor) => (
                            <tr key={doctor.id} className="border-t text-center">
                              <td className="border p-3">{doctor.name || "N/A"}</td>
                              <td className="border p-3">{doctor.specialization || "N/A"}</td>
                              <td className="border p-3">
                                <button
                                  onClick={() => handleRemoveDoctor(doctor.id)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="border p-3 text-center">No doctors assigned.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                <h2 className="text-xl font-semibold mb-4 mt-6">Add a Doctor</h2>
                <div className="mb-4">
                  <select onChange={handleSelectDoctor} value={selectedDoctor ? selectedDoctor.id : ''} className="p-2 border rounded w-full">
                    <option value="" disabled>Select a doctor</option>
                    {filteredAvailableDoctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleAddDoctor} disabled={!selectedDoctor} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Add
                  </button>
                </div>
                <PatientStatistics prescriptions={prescriptions} requests={requests} /> {/* Add PatientStatistics component */}
              </>
            } />
            <Route path="pending-prescriptions" element={<PendingPrescriptions prescriptions={prescriptions.filter(prescription => prescription.status === "Pending")} />} />
            <Route path="history" element={<History history={requests} />} /> {/* Ensure History displays patient's requests */}
            <Route path="prescription/:id" element={<PrescriptionDetails />} />
            <Route path="make-request" element={<MakeRequest />} />
          </Routes>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
