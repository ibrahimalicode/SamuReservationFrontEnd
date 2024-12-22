//MODULES
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    toast.loading("İşleniyor...");
    return;
  } else {
    toast.dismiss();
  }

  return !user ? <Navigate to="/login" /> : <Outlet />;
};

export default ProtectedRoute;