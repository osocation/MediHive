import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from "../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PharmacyStatistics = ({ medications, prescriptions }) => {
    const { currentUser } = useAuth();

    // Data for medications chart
    const medicationData = {
        labels: ['Available', 'Unavailable'],
        datasets: [
            {
                label: 'Medications',
                data: [
                    medications.filter(medication => medication.status === 'available').length,
                    medications.filter(medication => medication.status === 'unavailable').length,
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Data for prescriptions chart
    const prescriptionData = {
        labels: ['Pending', 'Fulfilled', 'Rejected'],
        datasets: [
            {
                label: 'Prescriptions',
                data: [
                    prescriptions.filter(prescription => prescription.status === 'Pending').length,
                    prescriptions.filter(prescription => prescription.status === 'fulfilled').length,
                    prescriptions.filter(prescription => prescription.status === 'rejected').length,
                ],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="pharmacy-statistics p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Pharmacy Statistics</h3>
            <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">Pharmacy Information</h4>
                <p><strong>Name:</strong> {currentUser.displayName}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Role:</strong> {currentUser.role}</p>
            </div>
            <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">Medication Statistics</h4>
                <Bar data={medicationData} />
            </div>
            <div>
                <h4 className="text-xl font-semibold mb-2">Prescription Statistics</h4>
                <Bar data={prescriptionData} />
            </div>
        </div>
    );
};

export default PharmacyStatistics;
