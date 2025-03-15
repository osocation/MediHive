import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRedirect = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" />; // Redirect to login if user isn't authenticated

  if (!currentUser.role) return <p>Loading...</p>; // Prevent redirecting before fetching role

  switch (currentUser.role) {
    case "admin":
      return <Navigate to="/dashboard/admin" />;
    case "doctor":
      return <Navigate to="/dashboard/doctor" />;
    case "patient":
      return <Navigate to="/dashboard/patient" />;
    case "pharmacy":
      return <Navigate to="/dashboard/pharmacy" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default RoleBasedRedirect;
