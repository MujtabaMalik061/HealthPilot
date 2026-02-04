import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export const ProtectedRoute = ({ children }) => {
  const { authAllow, loading, currentUser } = useAuth();

  if (loading)
    return (
      <Loader
        loading={true}
        size="50"
        style={{ height: "85vh", width: "100%" }}
      />
    );

  if (!authAllow) return <Navigate to="/login" replace />;

  return children;
};

export const PublicRoute = ({ children }) => {
  const { authAllow, loading } = useAuth();

  if (loading)
    return (
      <Loader
        loading={true}
        size="50"
        style={{ height: "85vh", width: "100%" }}
      />
    );

  if (authAllow) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
