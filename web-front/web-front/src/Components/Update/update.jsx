import React, { useState, useEffect } from "react";
import dementia_logo from '../Assets/dementia logo.png'
import './update.css'
import { useLocation, useNavigate } from "react-router-dom";   
import { auth } from "../../index";

const Update = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const user = auth.currentUser;
    const patient = state?.patient;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!patient) return;

        setFormData({
            firstName: patient.firstName || "",
            lastName: patient.lastName || "",
            dateOfBirth: patient.dateOfBirth || "",
        });
    }, [patient]);

    if (!patient) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <p>No patient selected.</p>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!user) throw new Error("User not authenticated");

            const token = await user.getIdToken();

            // The correct endpoint should be for APP users (patients), not web users
            const url = `http://localhost:3001/api/app/users/${patient.uid}/profile`;
            console.log("Updating patient at URL:", url);
            console.log("Sending data:", formData);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Failed to update patient: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log("Update successful:", result);

            // Clear localStorage to force refresh
            localStorage.removeItem("selectedPatient");

            alert("Patient updated successfully!");
            navigate("/welcome");
        } catch (error) {
            console.error("Error updating patient:", error);
            setError(error.message);
            alert(`Failed to update patient: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="top-right-container">
                <div className="title">NeuroMind System</div>
                <div className="logo">
                    <img src={dementia_logo} height={50} width={50} alt="" />
                </div>
            </div>

            <div className="update-container">
                <h2>Update Patient</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        padding: '15px',
                        borderRadius: '5px',
                        marginBottom: '20px'
                    }}>
                        Error: {error}
                    </div>
                )}

                <form className="update-form" onSubmit={handleSubmit}>
                    <label>
                        First Name
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Last Name
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Date of Birth
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <div className="update-buttons">
                        <button 
                            type="submit" 
                            className="save-btn"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button 
                            type="button" 
                            className="cancel-btn" 
                            onClick={() => navigate("/welcome")}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Update;