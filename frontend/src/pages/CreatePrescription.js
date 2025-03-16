import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Select from 'react-select';

const CreatePrescription = () => {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [dosage, setDosage] = useState("");
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
        }
      }
    };

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
        setError("Failed to load medications.");
      }
    };

    fetchPatients();
    fetchMedications();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!selectedPatient || !selectedMedication) {
      setError("Please select a patient and a medication.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "prescriptions"), {
        doctorId: currentUser.uid,
        patientId: selectedPatient.value,
        medication: selectedMedication.label,
        pharmacyId: selectedMedication.pharmacyId, // Include pharmacyId
        dosage,
        status,
        date: Timestamp.now() // Record the current date and time
      });
      setSuccess("Prescription created successfully.");
      setSelectedPatient(null);
      setSelectedMedication(null);
      setDosage("");
      setStatus("Pending");
    } catch (error) {
      console.error("Error creating prescription:", error);
      setError("Failed to create prescription. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const patientOptions = patients.map(patient => ({ value: patient.id, label: patient.name }));
  const medicationOptions = medications.map(medication => ({ value: medication.id, label: medication.name, pharmacyId: medication.pharmacyId }));

  return (
    <div className="create-prescription p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Create Prescription</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Patient</label>
          <Select
            options={patientOptions}
            value={selectedPatient}
            onChange={setSelectedPatient}
            className="w-full"
            placeholder="Select a patient"
            isClearable
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Medication</label>
          <Select
            options={medicationOptions}
            value={selectedMedication}
            onChange={setSelectedMedication}
            className="w-full"
            placeholder="Select a medication"
            isClearable
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Dosage</label>
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border rounded w-full"
            required
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </form>
    </div>
  );
};

export default CreatePrescription;