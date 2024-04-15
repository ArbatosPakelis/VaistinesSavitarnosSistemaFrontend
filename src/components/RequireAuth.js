import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Header from "./header.jsx";

const RequireAuth = ({ allowedRoles}) => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    auth?.role && Array.isArray(allowedRoles) && allowedRoles.includes(auth.role) ? (
        <>
            <Outlet/>
        </>
    ) : auth?.username ? (
      <>
        <Navigate to="/unauthorized" state={{ from: location }} replace />
      </>
    ) : (
      <>
        <Navigate to="/login" state={{ from: location }} replace />
      </>
    )
  );
};

export default RequireAuth;