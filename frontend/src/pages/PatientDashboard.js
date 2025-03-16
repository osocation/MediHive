import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Route, Routes, Link } from 'react-router-dom'; // Import Link
import PatientSidebar from "../components/PatientSidebar";
import DoctorList from '../components/DoctorList';
import PendingPrescriptions from '../components/PendingPrescriptions';
import History from '../components/History';
import PrescriptionDetails from '../components/PrescriptionDetails';
import MakeRequest from '../components/MakeRequest';
import PatientStatistics from '../components/PatientStatistics';

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);

  useEffect(() => {
    let isMounted = true;

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
      }
    };

    fetchAvailableDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

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
        }
      }
    };

    fetchAssignedDoctors();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleAddDoctor = async (doctor) => {
    setDoctors([...doctors, doctor]);
    const patientRef = doc(db, "users", currentUser.uid);
    await updateDoc(patientRef, {
      assignedDoctors: arrayUnion(doctor.id)
    });
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
      <PatientSidebar />
      <div className="main-content flex-1 p-6 bg-gray-100">
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
                <Link to="/dashboard/patient/choose-doctors" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                  Choose Doctors
                </Link>
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
                          <td colSpan="3" className="p-4 text-center">
                            No doctors assigned yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          } />
          <Route path="choose-doctors" element={<DoctorList doctors={doctors} availableDoctors={filteredAvailableDoctors} onAddDoctor={handleAddDoctor} onRemoveDoctor={handleRemoveDoctor} patientId={currentUser.uid} />} />
          <Route path="pending-prescriptions" element={<PendingPrescriptions prescriptions={prescriptions.filter(prescription => prescription.status === "Pending")} />} />
          <Route path="history" element={<History history={prescriptions.filter(prescription => prescription.status !== "Pending")} requests={requests} />} />
          <Route path="prescription/:id" element={<PrescriptionDetails />} />
          <Route path="make-request" element={<MakeRequest />} />
        </Routes>
      </div>
    </div>
  );
};

export default PatientDashboard;
