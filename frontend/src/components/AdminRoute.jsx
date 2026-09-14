import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {

  const { user } = useAuth();

  if (user?.role !== "Admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

export default AdminRoute;