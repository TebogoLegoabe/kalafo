import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // In a real app, you would check authentication and user role from your auth context
  const isAuthenticated = true; // Replace with actual auth check
  const userRole = 'doctor'; // Replace with actual user role from context
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;