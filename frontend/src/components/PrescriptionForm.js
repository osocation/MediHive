import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const PrescriptionForm = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedMedication, setSelectedMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch patients
    const fetchPatients = async () => {
      const q = query(collection(db, "users"), where("role", "==", "patient"));
      const snapshot = await getDocs(q);
      setPatients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    // Fetch available medications
    const fetchMedications = async () => {
      const q = collection(db, "medications");
      const snapshot = await getDocs(q);
      setMedications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchPatients();
    fetchMedications();
  }, [currentUser]);

  // Handle prescription submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !selectedMedication || !dosage) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "prescriptions"), {
        doctorId: currentUser.uid,
        doctorName: currentUser.displayName || "Unknown Doctor",
        patientId: selectedPatient,
        medicationId: selectedMedication,
        dosage,
        instructions,
        status: "Pending Doctor Approval",
        createdAt: new Date(),
      });

      alert("Prescription submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating prescription:", error);
      alert("Failed to create prescription.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create Prescription</h2>

      {/* Select Patient */}
      <label className="block font-semibold">Select Patient</label>
      <select
        value={selectedPatient}
        onChange={(e) => setSelectedPatient(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        required
      >
        <option value="">-- Select Patient --</option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.fullName} ({patient.email})
          </option>
        ))}
      </select>

      {/* Select Medication */}
      <label className="block font-semibold">Select Medication</label>
      <select
        value={selectedMedication}
        onChange={(e) => setSelectedMedication(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        required
      >
        <option value="">-- Select Medication --</option>
        {medications.map((med) => (
          <option key={med.id} value={med.id}>
            {med.name} - {med.amountAvailable} in stock
          </option>
        ))}
      </select>

      {/* Dosage */}
      <label className="block font-semibold">Dosage</label>
      <input
        type="text"
        placeholder="Enter dosage (e.g., 500mg)"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        required
      />

      {/* Instructions */}
      <label className="block font-semibold">Instructions</label>
      <textarea
        placeholder="Enter instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded mt-3 hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Prescription"}
      </button>
    </div>
  );
};

export default PrescriptionForm;
