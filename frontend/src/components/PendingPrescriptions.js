import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Select from 'react-select';

// Component to display pending prescriptions
const PendingPrescriptions = () => {
    const { currentUser } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch prescriptions for the current user
    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (currentUser) {
                try {
                    const q = query(collection(db, "prescriptions"), where("patientId", "==", currentUser.uid));
                    const querySnapshot = await getDocs(q);
                    const prescriptionsData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setPrescriptions(prescriptionsData);
                } catch (error) {
                    console.error("Error fetching prescriptions:", error);
                    setError("Failed to load prescriptions.");
                } finally {
                    setLoading(false);
                }
            }
        };

        // Fetch all pharmacies
        const fetchPharmacies = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "pharmacies"));
                const pharmaciesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPharmacies(pharmaciesData);
            } catch (error) {
                console.error("Error fetching pharmacies:", error);
                setError("Failed to load pharmacies.");
            }
        };

        fetchPrescriptions();
        fetchPharmacies();
    }, [currentUser]);

    // Handle pharmacy selection change
    const handlePharmacyChange = async (prescriptionId, selectedPharmacy) => {
        try {
            const prescriptionRef = doc(db, "prescriptions", prescriptionId);
            await updateDoc(prescriptionRef, {
                pharmacyId: selectedPharmacy.value,
                pharmacyName: selectedPharmacy.label
            });
            setPrescriptions(prescriptions.map(prescription => 
                prescription.id === prescriptionId ? { ...prescription, pharmacyId: selectedPharmacy.value, pharmacyName: selectedPharmacy.label } : prescription
            ));
        } catch (error) {
            console.error("Error updating prescription:", error);
            setError("Failed to update prescription. Please try again later.");
        }
    };

    const pharmacyOptions = pharmacies.map(pharmacy => ({ value: pharmacy.id, label: pharmacy.name }));

    return (
        <div className="pending-prescriptions p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Prescriptions</h3>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Prescription ID</th>
                            <th className="py-2 px-4 border-b">Medication</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Date</th>
                            <th className="py-2 px-4 border-b">Pharmacy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.length > 0 ? (
                            prescriptions.map((prescription) => (
                                <tr key={prescription.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{prescription.id}</td>
                                    <td className="py-2 px-4 border-b">{prescription.medication}</td>
                                    <td className="py-2 px-4 border-b">{prescription.status}</td>
                                    <td className="py-2 px-4 border-b">{new Date(prescription.date.seconds * 1000).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b">
                                        {prescription.status === "Approved" ? (
                                            <Select
                                                options={pharmacyOptions}
                                                value={pharmacyOptions.find(option => option.value === prescription.pharmacyId)}
                                                onChange={(selectedPharmacy) => handlePharmacyChange(prescription.id, selectedPharmacy)}
                                                className="w-full"
                                                placeholder="Select a pharmacy"
                                                isClearable
                                            />
                                        ) : (
                                            <span>N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-4 text-center">
                                    No prescriptions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PendingPrescriptions;
