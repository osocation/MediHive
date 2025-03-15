import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { currentUser } = useAuth();

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold">MediHive</Link>
        <nav>
          {currentUser ? (
            <Link to="/dashboard" className="bg-white text-blue-600 px-4 py-2 rounded-md">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="px-4">Login</Link>
              <Link to="/register" className="px-4 bg-white text-blue-600 py-2 rounded-md">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
