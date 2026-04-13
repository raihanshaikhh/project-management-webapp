import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // Not logged in → redirect
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  // Logged in → render child routes
  return <Outlet />;
}