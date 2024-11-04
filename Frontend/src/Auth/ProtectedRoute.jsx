import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  // Check for the token
  const token = localStorage.getItem('authToken');
//   const decoded = jwtDecode(token);

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
//   if(decoded.isDriver === true){
//     return <Navigate to="/dashboard/driver" replace />;
//   }
  // If token exists, render the child component
  return children;
};

export default ProtectedRoute;
