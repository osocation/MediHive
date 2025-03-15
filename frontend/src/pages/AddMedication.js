import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const AddMedication = () => {
  const { currentUser } = useAuth();
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    form: "",
    manufacturer: "",
    amountAvailable: 0,
    prescriptionRequired: true,
  });

  const handleChange = (e) => {
    setNewMed({ ...newMed, [e.target.name]: e.target.value });
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "medications"), {
        ...newMed,
        amountAvailable: Number(newMed.amountAvailable),
        pharmacyId: currentUser.uid,
        pharmacyName: currentUser.displayName || "Unknown Pharmacy",
      });
      setNewMed({ name: "", dosage: "", form: "", manufacturer: "", amountAvailable: 0, prescriptionRequired: true });
      alert("Medication added successfully!");
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Medication</h1>
      <form onSubmit={handleAddMedication} className="bg-white shadow-md rounded-lg p-4">
        <input type="text" name="name" placeholder="Medication Name" value={newMed.name} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <input type="text" name="dosage" placeholder="Dosage (e.g., 500mg)" value={newMed.dosage} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <input type="text" name="form" placeholder="Form (e.g., Tablet, Capsule)" value={newMed.form} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <input type="text" name="manufacturer" placeholder="Manufacturer" value={newMed.manufacturer} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <input type="number" name="amountAvailable" placeholder="Stock Amount" value={newMed.amountAvailable} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700 transition">
          Add Medication
        </button>
      </form>
    </div>
  );
};

export default AddMedication;
