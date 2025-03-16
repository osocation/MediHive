import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

// Component for making a request
const MakeRequest = () => {
    const { currentUser } = useAuth(); // Get the current user from the AuthContext
    const [description, setDescription] = useState(''); // State for the request description
    const [assignedDoctors, setAssignedDoctors] = useState([]); // State for the list of assigned doctors
    const [selectedDoctor, setSelectedDoctor] = useState(''); // State for the selected doctor
    const [loading, setLoading] = useState(false); // State for the loading status
    const [error, setError] = useState(null); // State for the error message
    const [success, setSuccess] = useState(null); // State for the success message

    // Fetch the assigned doctors when the component mounts or the current user changes
    useEffect(() => {
        const fetchAssignedDoctors = async () => {
            if (currentUser) {
                try {
                    const patientRef = doc(db, "users", currentUser.uid); // Reference to the current user's document
                    const patientDoc = await getDoc(patientRef); // Get the current user's document
                    const assignedDoctorIds = patientDoc.data().assignedDoctors || []; // Get the list of assigned doctor IDs
                    const assignedDoctorsData = await Promise.all(
                        assignedDoctorIds.map(async (doctorId) => {
                            const doctorRef = doc(db, "users", doctorId); // Reference to the doctor's document
                            const doctorDoc = await getDoc(doctorRef); // Get the doctor's document
                            return { id: doctorDoc.id, ...doctorDoc.data() }; // Return the doctor's data with the ID
                        })
                    );
                    setAssignedDoctors(assignedDoctorsData); // Set the list of assigned doctors
                } catch (error) {
                    console.error("Error fetching assigned doctors:", error); // Log any errors
                }
            }
        };

        fetchAssignedDoctors(); // Call the function to fetch assigned doctors
    }, [currentUser]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        setError(null); // Clear any previous errors
        setSuccess(null); // Clear any previous success messages

        try {
            await addDoc(collection(db, "requests"), {
                patientId: currentUser.uid, // Set the patient ID to the current user's ID
                doctorId: selectedDoctor, // Set the doctor ID to the selected doctor
                description, // Set the description to the entered description
                status: "Pending", // Set the status to "Pending"
                date: Timestamp.now() // Record the current date and time
            });
            setSuccess("Request submitted successfully."); // Set the success message
            setDescription(''); // Clear the description
            setSelectedDoctor(''); // Clear the selected doctor
        } catch (error) {
            console.error("Error submitting request:", error); // Log any errors
            setError("Failed to submit request. Please try again later."); // Set the error message
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    return (
        <div className="make-request p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Make a Request</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Assigned Doctor</label>
                    <select
                        className="p-2 border rounded w-full"
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a doctor</option>
                        {assignedDoctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        className="p-2 border rounded w-full"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
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

export default MakeRequest;
