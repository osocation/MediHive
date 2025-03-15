import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { currentUser } = useAuth();

  return currentUser && currentUser.role === "admin" ? <Outlet /> : <Navigate to="/access-denied" />;
};

export default AdminRoute;
