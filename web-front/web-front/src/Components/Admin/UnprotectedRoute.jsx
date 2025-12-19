import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../utils/firebaseAdminConfig.js";

const AdminUnprotectedRoute = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setLoggedIn(!!user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading user details...</div>;
    }

    if (loggedIn) {
        return <Navigate to="/admin/welcome" replace />;
    }

    return children;
};


export default AdminUnprotectedRoute;