import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'SYSTEM ADMINISTRATOR') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'STORE OWNER') return <Navigate to="/owner/dashboard" replace />;
    if (user.role === 'NORMAL USER') return <Navigate to="/stores" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleRoute;
