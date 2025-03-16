import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const MakeRequest = () => {
    const { currentUser } = useAuth();
    const [description, setDescription] = useState('');
    const [assignedDoctors, setAssignedDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchAssignedDoctors = async () => {
            if (currentUser) {
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
                    setAssignedDoctors(assignedDoctorsData);
                } catch (error) {
                    console.error("Error fetching assigned doctors:", error);
                }
            }
        };

        fetchAssignedDoctors();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await addDoc(collection(db, "requests"), {
                patientId: currentUser.uid,
                doctorId: selectedDoctor,
                description,
                status: "Pending",
                date: Timestamp.now() // Record the current date and time
            });
            setSuccess("Request submitted successfully.");
            setDescription('');
            setSelectedDoctor('');
        } catch (error) {
            console.error("Error submitting request:", error);
            setError("Failed to submit request. Please try again later.");
        } finally {
            setLoading(false);
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
