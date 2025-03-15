import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Helper function to extract role from URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const RegisterPage = () => {
  const query = useQuery();
  const [role, setRole] = useState(query.get("role") || "patient");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    licenseNumber: "",
    specialization: "",
    pharmacyName: "",
    address: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setRole(query.get("role") || "patient");
  }, [query]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        role,
        phoneNumber: formData.phoneNumber || "",
        dateOfBirth: formData.dateOfBirth || "",
        licenseNumber: role === "doctor" || role === "pharmacy" ? formData.licenseNumber : "",
        specialization: role === "doctor" ? formData.specialization : "",
        pharmacyName: role === "pharmacy" ? formData.pharmacyName : "",
        address: role === "pharmacy" ? formData.address : "",
        createdAt: new Date(),
      });

      alert("✅ Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      alert("⚠️ Registration failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-md bg-white shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>

        {/* Role Selection (Disabled if user came from LandingPage) */}
        <label className="block font-semibold mb-1">Select Role</label>
        <select 
          name="role" 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          className="w-full p-2 border rounded mb-4"
          disabled={query.get("role") !== null} // Prevent changing role if preselected
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="pharmacy">Pharmacy</option>
        </select>

        {/* Common Fields */}
        <input type="text" name="fullName" placeholder="Full Name" className="w-full p-2 mb-2 border rounded" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="w-full p-2 mb-2 border rounded" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 mb-2 border rounded" onChange={handleChange} required />

        {/* Role-Specific Fields */}
        {role === "doctor" && (
          <>
            <input type="text" name="licenseNumber" placeholder="Medical License Number" className="w-full p-2 mb-2 border rounded" onChange={handleChange} required />
            <input type="text" name="specialization" placeholder="Specialization (e.g., Cardiology)" className="w-full p-2 mb-2 border rounded" onChange={handleChange} required />
          </>
        )}
        
        {role === "pharmacy" && (
          <>
            <input type="text" name="pharmacyName" placeholder="Pharmacy Name" className="w-full p-2 mb-2 border rounded" onChange={handleChange} required />
            <input type="text" name="licenseNumber" placeholder="Pharmacy License Number" className="w-full p-2 mb-2 border rounded" onChange={handleChange} required />
            <input type="text" name="address" placeholder="Pharmacy Address" className="w-full p-2 mb-2 border rounded" onChange={handleChange} required />
          </>
        )}

        <button onClick={handleRegister} className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700 transition">
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
