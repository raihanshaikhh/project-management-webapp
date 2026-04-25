import { Navigate, Outlet } from "react-router-dom";

export const getToken = () => localStorage.getItem("token");

export default function ProtectedRoute() {
  const token = getToken();

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}