import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ doctors, onSelectDoctor }) => {
    return (
        <div className="sidebar bg-gray-800 text-white w-64 min-h-screen shadow-lg">
            <h3 className="text-2xl font-bold p-4 border-b border-gray-700">Menu</h3>
            <ul className="p-4">
                <li className="mb-2">
                    <Link to="/dashboard/patient/choose-doctors" className="block py-2 px-4 rounded hover:bg-gray-700 transition">
                        Choose Doctors
                    </Link>
                </li>
                <li className="mb-2">
                    <Link to="/dashboard/patient/pending-prescriptions" className="block py-2 px-4 rounded hover:bg-gray-700 transition">
                        Pending Prescriptions
                    </Link>
                </li>
                <li className="mb-2">
                    <Link to="/dashboard/patient/history" className="block py-2 px-4 rounded hover:bg-gray-700 transition">
                        History
                    </Link>
                </li>
                <li className="mb-2">
                    <Link to="/dashboard/patient/make-request" className="block py-2 px-4 rounded hover:bg-gray-700 transition">
                        Make a Request
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
