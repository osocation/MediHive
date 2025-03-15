import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import AdminSidebar from "../components/AdminSidebar";

const roles = ["user", "doctor", "pharmacy", "admin"]; // Available roles

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, "users"));
      setUsers(usersCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      alert("✅ Role updated successfully!");
    } catch (error) {
      console.error("❌ Error updating role:", error);
      alert("⚠️ Failed to update role.");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border">
                <td className="border p-2">{user.name || "No Name"}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  <select
                    className="border p-1 rounded"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleRoleChange(user.id, "user")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reset to User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
