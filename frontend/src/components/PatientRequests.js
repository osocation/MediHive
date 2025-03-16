import React from 'react';

const PatientRequests = ({ requests }) => {
    return (
        <div className="patient-requests p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Patient Requests</h3>
            <ul className="list-disc pl-5">
                {requests.map((request, index) => (
                    <li key={index} className="mb-2">
                        <p><strong>Description:</strong> {request.description}</p>
                        <p><strong>Status:</strong> {request.status}</p>
                        <p><strong>Date:</strong> {request.createdAt.toDate().toLocaleDateString()}</p>
                        {/* Add actions for doctors */}
                        <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Create Prescription</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientRequests;
