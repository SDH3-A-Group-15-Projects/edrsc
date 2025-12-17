import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../utils/firebaseAdminConfig.js";

const AdminProtectedRoute = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading user details...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};


export default AdminProtectedRoute;