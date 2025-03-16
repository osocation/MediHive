import React, { useState } from "react";
import { functions } from "../firebaseConfig";
import { httpsCallable } from "firebase/functions";

const CreatePrescription = () => {
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const createPrescription = httpsCallable(functions, "createPrescription");
    try {
      await createPrescription({ doctorId, patientId, medication, dosage, instructions });
      setSuccess("Prescription created successfully!");
      setError("");
    } catch (error) {
      setError("Error creating prescription: " + error.message);
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Create Prescription</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Doctor ID"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Medication"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700 transition">
          Create Prescription
        </button>
      </form>
    </div>
  );
};

export default CreatePrescription;