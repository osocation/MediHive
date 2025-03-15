import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AccessDenied = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get user authentication state

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (currentUser) {
        navigate("/dashboard"); // If logged in, go to Dashboard
      } else {
        navigate("/login"); // If NOT logged in, go to Login
      }
    }, 3000); // Auto-redirect after 3 seconds

    return () => clearTimeout(redirectTimeout); // Cleanup on unmount
  }, [currentUser, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600">🚫 Access Denied</h1>
      <p className="mt-4 text-lg text-gray-700">
        You do not have permission to access this page.
      </p>
      <p className="mt-2 text-gray-500">
        Redirecting you {currentUser ? "to your dashboard" : "to login"} in 3 seconds...
      </p>
    </div>
  );
};

export default AccessDenied;
