import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const History = () => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, "requests"), where("patientId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const historyData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHistory(historyData);
        } catch (error) {
          console.error("Error fetching history:", error);
          setError("Failed to load history.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHistory();
  }, [currentUser]);

  return (
    <div className="history p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Request History</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Request ID</th>
              <th className="py-2 px-4 border-b">Request Type</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Time</th> {/* Add Time column */}
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{request.id}</td>
                  <td className="py-2 px-4 border-b">{request.type}</td>
                  <td className="py-2 px-4 border-b">{request.status}</td>
                  <td className="py-2 px-4 border-b">{request.date ? new Date(request.date.seconds * 1000).toLocaleDateString() : "N/A"}</td>
                  <td className="py-2 px-4 border-b">{request.date ? new Date(request.date.seconds * 1000).toLocaleTimeString() : "N/A"}</td> {/* Display Time */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
