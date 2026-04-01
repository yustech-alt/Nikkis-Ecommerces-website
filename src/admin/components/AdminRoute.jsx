import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isAuth = localStorage.getItem("nikkis_admin") === "true";
  return isAuth ? children : <Navigate to="/admin" replace />;
}