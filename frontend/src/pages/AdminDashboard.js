import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Link } from 'react-router-dom'; // Import Link

const AdminDashboard = () => {
  // State to store the list of users
  const [users, setUsers] = useState([]);
  // State to manage the loading state
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from the "users" collection in Firestore
        const querySnapshot = await getDocs(collection(db, "users"));
        // Map the fetched documents to user objects
        const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Update the state with the fetched users
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        // Set loading to false after fetching users
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle role change for a user
  const handleRoleChange = async (userId, newRole) => {
    try {
      // Reference to the user document in Firestore
      const userRef = doc(db, "users", userId);
      // Update the user's role in Firestore
      await updateDoc(userRef, { role: newRole });
      // Update the state with the new role
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">Role</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="text-center border-t">
                    <td className="border p-3">{user.name || "N/A"}</td>
                    <td className="border p-3">{user.email}</td>
                    <td className="border p-3">
                      <select
                        className="border p-2 rounded"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="border p-3">
                      <button
                        onClick={() => handleRoleChange(user.id, "admin")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Promote to Admin
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6">
              <Link to="/manage-users" className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition">
                Manage Users
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
