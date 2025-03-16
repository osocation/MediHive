import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Header = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-blue-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">MediHive</Link>
        </h1>
        <nav>
          {currentUser ? (
            <>
              <span className="mr-4">Welcome, {currentUser.email}</span>
              <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
