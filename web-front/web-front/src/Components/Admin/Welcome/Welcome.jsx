import React, { useEffect, useState } from 'react';
import dementia_logo from '../../Assets/dementia logo.png';
import './Welcome.css';
import { auth } from "../../../index";
import { Link } from "react-router-dom";

const AdminWelcome = () => {
    const user = auth.currentUser;

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const validateDoctor = (data) => {
        return {
            uid: data.uid,
            firstName: data.firstName || "N/A",
            lastName: data.lastName || "N/A",
            noOfPatients: data.noOfPatients != null ? data.noOfPatients : 0,
        };
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            console.log(`Doctor with id ${id} deleted.`);
        }
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                if (!user) throw new Error("User not logged in");
                const token = await user.getIdToken();

                const response = await fetch(`http://localhost:3001/api/admin/doctors/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch doctors");

                const data = await response.json();
                const cleanData = (data || []).map(validateDoctor);
                setDoctors(cleanData);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [user]);

    return (
        <>
            <div className="top-right-container">
                <div className='title'>NeuroMind System</div>
                <div className='logo'>
                    <img src={dementia_logo} height={50} width={50} alt="Logo" />
                </div>
            </div>

            <div className="header">
                <div className="text">Welcome Admin</div>
            </div>

            <div className="backdrop">
                <div className="table-container">
                    <h2>Doctor Profiles</h2>
                    <table className="patient-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>No. of Patients</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center" }}>No doctors found.</td>
                                </tr>
                            ) : (
                                doctors.map((doctor) => (
                                    <tr key={doctor.uid}>
                                        <td>
                                            <Link 
                                                to="/update-doctor" 
                                                state={{ doctor }} 
                                                className="patient-link"
                                            >
                                                {`${doctor.lastName}, ${doctor.firstName}`}
                                            </Link>
                                        </td>
                                        <td>{doctor.noOfPatients}</td>
                                        <td className="action-button">
                                            <Link 
                                                to="/update-doctor" 
                                                state={{ doctor }} 
                                                className="update-btn"
                                            >
                                                Update
                                            </Link>
                                            <button 
                                                className="delete-btn" 
                                                onClick={() => handleDelete(doctor.uid)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="welcome-buttons">
                    <Link to="/data" className="welcome-btn">Data Aggregation</Link>
                </div>
            </div>
        </>
    );
};

export default AdminWelcome;
