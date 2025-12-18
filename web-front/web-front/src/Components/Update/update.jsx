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
    useEffect(() => {
        if (!patient) return;

        setFormData({
            firstName: patient.firstName,
            lastName: patient.lastName,
            dateOfBirth: patient.dateOfBirth,
        });
    }, [patient]);


            if (!patient) {
        return <p>No patient selected.</p>;
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

        try {
            if (!user) throw new Error("User not authenticated");

            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:3001/api/web/users/${user.uid}/patients/${patient.uid}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
        }
    );

            if (!response.ok) throw new Error("Failed to update patient");

            navigate(-1);
        } catch (error) {
            console.error("Error updating patient:", error);
            alert("Failed to update patient.");
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

            <form className="update-form" onSubmit={handleSubmit}>
                <label>
                    First Name
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Last Name
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Date of Birth
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </label>

                <div className="update-buttons">
                    <button type="submit" className="save-btn">
                        Save Changes
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                </div>
            </form>
                </div>

        </>
    );
};

export default Update;