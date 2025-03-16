import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const DoctorList = ({ doctors, availableDoctors, onAddDoctor, onRemoveDoctor, patientId }) => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const handleSelectDoctor = (event) => {
        const doctorId = event.target.value;
        const doctor = availableDoctors.find(doc => doc.id === doctorId);
        setSelectedDoctor(doctor);
    };

    const handleAddDoctor = async () => {
        if (selectedDoctor) {
            onAddDoctor(selectedDoctor);
            setSelectedDoctor(null); // Reset the selected doctor
            // Store the chosen doctor in the database
            const patientRef = doc(db, "users", patientId);
            await updateDoc(patientRef, {
                assignedDoctors: arrayUnion(selectedDoctor.id)
            });
        }
    };

    const handleRemoveDoctor = async (doctorId) => {
        onRemoveDoctor(doctorId);
        // Remove the doctor from the database
        const patientRef = doc(db, "users", patientId);
        await updateDoc(patientRef, {
            assignedDoctors: arrayRemove(doctorId)
        });
    };

    return (
        <div className="doctor-list p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Choose Doctors</h3>
            <div className="mb-4">
                <select onChange={handleSelectDoctor} value={selectedDoctor ? selectedDoctor.id : ''} className="p-2 border rounded w-full">
                    <option value="" disabled>Select a doctor</option>
                    {availableDoctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                            {doctor.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddDoctor} disabled={!selectedDoctor} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Add
                </button>
            </div>
            <h3 className="text-2xl font-bold mb-4">Assigned Doctors</h3>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Specialization</th>
                        <th className="py-2 px-4 border-b">Pending Prescriptions</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doctor, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{doctor.name}</td>
                            <td className="py-2 px-4 border-b">{doctor.email}</td>
                            <td className="py-2 px-4 border-b">{doctor.specialization}</td>
                            <td className="py-2 px-4 border-b">{doctor.pendingPrescriptions}</td>
                            <td className="py-2 px-4 border-b">
                                <button onClick={() => handleRemoveDoctor(doctor.id)} className="text-red-500 hover:text-red-700 transition">Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorList;
