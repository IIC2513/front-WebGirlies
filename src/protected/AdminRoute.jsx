import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import AdminUserList from "./AdminUserList";

function decodeJWT(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

const AdminRoute = () => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = decodeJWT(token);
    if (!decoded.scope?.includes("admin")) {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/" replace />;
  }

  return <AdminUserList />;
};

export default AdminRoute;
