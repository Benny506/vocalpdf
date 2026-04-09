import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectAdmin } from '../../store/slices/adminSlice';

/**
 * AdminGuard: The protective shield of the Sovereign Admin Citadel.
 * Restricts access to the command center to authorized administrators only.
 */
export const AdminGuard = ({ children }) => {
    const { isAdminAuthenticated } = useSelector(selectAdmin);
    const location = useLocation();

    if (!isAdminAuthenticated) {
        // Redirect to admin login while saving the attempted location
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminGuard;
