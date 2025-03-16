import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from "../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DoctorStatistics = ({ prescriptions, patients }) => {
    const { currentUser } = useAuth();

    // Data for prescriptions chart
    const prescriptionData = {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [
            {
                label: 'Prescriptions',
                data: [
                    prescriptions.filter(prescription => prescription.status === 'Pending').length,
                    prescriptions.filter(prescription => prescription.status === 'Approved').length,
                    prescriptions.filter(prescription => prescription.status === 'Rejected').length,
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Data for patients chart
    const patientData = {
        labels: ['Total Patients'],
        datasets: [
            {
                label: 'Patients',
                data: [patients.length],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="doctor-statistics p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Doctor Statistics</h3>
            <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">Doctor Information</h4>
                <p><strong>Name:</strong> {currentUser.displayName}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Role:</strong> {currentUser.role}</p>
            </div>
            <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">Prescription Statistics</h4>
                <Bar data={prescriptionData} />
            </div>
            <div>
                <h4 className="text-xl font-semibold mb-2">Patient Statistics</h4>
                <Bar data={patientData} />
            </div>
        </div>
    );
};

export default DoctorStatistics;
