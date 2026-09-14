import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";


const ProtectedRoute = ({ children }) => {

  const {
    isAuthenticated
  } = useAuth();


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  return children;
};


export default ProtectedRoute;