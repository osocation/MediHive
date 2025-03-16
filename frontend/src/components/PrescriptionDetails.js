import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const PrescriptionDetails = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrescription = async () => {
            try {
                const prescriptionRef = doc(db, "prescriptions", id);
                const prescriptionDoc = await getDoc(prescriptionRef);
                if (prescriptionDoc.exists()) {
                    setPrescription(prescriptionDoc.data());
                } else {
                    setError("Prescription not found");
                }
            } catch (error) {
                console.error("Error fetching prescription:", error);
                setError("Failed to fetch prescription. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPrescription();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="prescription-details p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Prescription Details</h3>
            <p><strong>Medicine:</strong> {prescription.medicine}</p>
            <p><strong>Doctor:</strong> {prescription.doctor}</p>
            <p><strong>Status:</strong> {prescription.status}</p>
            <p><strong>Date Issued:</strong> {prescription.issuedAt ? new Date(prescription.issuedAt.toDate()).toLocaleDateString() : "N/A"}</p>
            {/* Add more details as needed */}
            {currentUser.role === "doctor" && (
                <div className="mt-4">
                    {/* Add actions for doctors */}
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Approve</button>
                    <button className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Reject</button>
                </div>
            )}
        </div>
    );
};

export default PrescriptionDetails;
