import React from 'react';
import { Link } from 'react-router-dom';

const PendingPrescriptions = ({ prescriptions }) => {
    return (
        <div className="pending-prescriptions p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Pending Prescriptions</h3>
            <ul className="list-disc pl-5">
                {prescriptions.map((prescription, index) => (
                    <li key={index} className="mb-2">
                        <Link to={`/dashboard/patient/prescription/${prescription.id}`} className="text-blue-600 hover:underline">
                            {prescription.medicine} - {prescription.doctor}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PendingPrescriptions;
