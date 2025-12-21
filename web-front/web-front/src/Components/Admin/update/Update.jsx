import React, { useState, useEffect } from "react";
import dementia_logo from '../../Assets/dementia logo.png'
import './Update.css'
import { useLocation, useNavigate } from "react-router-dom";   
import { auth } from "../../../firebaseConfig";

const AdminUpdate = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const user = auth.currentUser;
    const doctor = state?.doctor;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!doctor) return;

        setFormData({
            firstName: doctor.firstName || "",
            lastName: doctor.lastName || "",
        });
    }, [doctor]);

    if (!doctor) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <p>No doctor selected.</p>
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

            const url = `http://localhost:3001/api/web/doctor`;
            console.log("Updating doctor at URL:", url);
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
            localStorage.removeItem("selectedDoctor");

            alert("Doctor updated successfully!");
            navigate("/welcome");
        } catch (error) {
            console.error("Error updating doctor:", error);
            setError(error.message);
            alert(`Failed to update doctor: ${error.message}`);
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
                <h2>Update Doctor</h2>

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

export default AdminUpdate;