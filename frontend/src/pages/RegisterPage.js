import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient", // Default role
    licenseNumber: "",
    pharmacyName: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Store additional user details in Firestore
      const userDoc = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.role === "doctor") {
        userDoc.licenseNumber = formData.licenseNumber;
      }
      if (formData.role === "pharmacy") {
        userDoc.pharmacyName = formData.pharmacyName;
      }

      await setDoc(doc(db, "users", user.uid), userDoc);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-md bg-white shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 mb-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 mb-2 border rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 mb-2 border rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="w-full p-2 mb-2 border rounded"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="pharmacy">Pharmacy</option>
          </select>

          {/* Doctor-Specific Field */}
          {formData.role === "doctor" && (
            <input
              type="text"
              name="licenseNumber"
              placeholder="Medical License Number"
              className="w-full p-2 mb-2 border rounded"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
          )}

          {/* Pharmacy-Specific Field */}
          {formData.role === "pharmacy" && (
            <input
              type="text"
              name="pharmacyName"
              placeholder="Pharmacy Name"
              className="w-full p-2 mb-2 border rounded"
              value={formData.pharmacyName}
              onChange={handleChange}
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account? <a href="/login" className="text-blue-600 underline">Login here</a>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
