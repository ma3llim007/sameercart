// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
    // Get the authentication status from Redux store
    const isAuthenticated = useSelector(state => state.auth);
    console.log(isAuthenticated);
    

    // If not authenticated, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/admin/auth/login" replace />;
    }

    // If authenticated, render the requested element
    return element;
};

export default ProtectedRoute;
