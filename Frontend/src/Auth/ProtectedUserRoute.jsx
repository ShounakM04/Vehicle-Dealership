import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


const ProtectedUserRoute = ({ children, requiredRole }) => {
  // Check for the token
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  // Decode the token to check the user's role
  const decoded = jwtDecode(token);

  // Check if the user has the required role
  if (requiredRole === 'driver' && decoded.isDriver) {
    return <Navigate to="/dashboard/driver" replace />;
  }
  else if (requiredRole === 'admin' && decoded.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  else if (requiredRole === 'employee' && decoded.isEmployee) {
    return <Navigate to="/dashboard" replace />;
  }
  // If role matches, render the child component
  return children;
};

export default ProtectedUserRoute;
