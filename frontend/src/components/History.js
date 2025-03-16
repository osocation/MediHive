import React from 'react';
import { Link } from 'react-router-dom';

const History = ({ history, requests }) => {
    return (
        <div className="history p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-4">History</h3>
            <ul className="list-disc pl-5">
                {history.map((record, index) => (
                    <li key={index} className="mb-2">
                        <Link to={`/dashboard/patient/prescription/${record.id}`} className="text-blue-600 hover:underline">
                            {record.date} - {record.details}
                        </Link>
                    </li>
                ))}
                {requests.map((request, index) => (
                    <li key={index} className="mb-2">
                        <p><strong>Description:</strong> {request.description}</p>
                        <p><strong>Status:</strong> {request.status === "Pending" ? "Pending" : "Closed"}</p>
                        <p><strong>Date:</strong> {request.createdAt.toDate().toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;
