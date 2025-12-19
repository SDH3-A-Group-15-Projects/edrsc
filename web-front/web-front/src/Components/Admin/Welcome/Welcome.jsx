import React from 'react';
import dementia_logo from '../../Assets/dementia logo.png'
import './Welcome.css'
import { useEffect, useState } from 'react'
import { auth } from "../../../index";
import { Link, useLocation } from "react-router-dom";


const AdminWelcome = () => {
    const location = useLocation();
    const user = auth.currentUser;
    const lastName = user?.displayName || "";

        const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            console.log(`Doctor with id ${id} deleted.`);
        }
    };


    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const validateDoctor = (data) => {
        return {
            uid: data.uid,
            checked: false,    
            firstName: (data.firstName && data.firstName !== "") ? data.firstName : "N/A",
            lastName: (data.lastName && data.lastName !== "") ? data.lastName : "N/A",
            dateOfBirth: (data.dateOfBirth && data.dateOfBirth !== "") ? data.dateOfBirth : "N/A",
        };
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {      
                if (!user) throw new Error("User not logged in");
                const token = await user.getIdToken();

                const response = await fetch(`http://localhost:3001/api/web/users/${user.uid}/doctors/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch patients");

                const data = await response.json();
                const cleanData = (data || []).map(validateDoctor);
                setDoctors(cleanData);
                }
                catch (err) {
                console.error("Error fetching Doctors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
        }, []);

    return(
    <>
        <div className="top-right-container">
            <div className='title'>NeuroMind System</div>
                <div className='logo'>
                <img src = {dementia_logo} height={50} width={50} alt="" />
                </div>
        </div>
        <div className="header">
            <div className="text">Welcome</div>
        </div>
    <div className="backdrop">
        <div className="table-container">
            <h2>Patient Profiles</h2>
            <table className="patient-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date of Birth</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doctor) => (
                        <tr key={doctor.id}>
                            <td>
                                <Link to="/dashboard" state={{ doctor }} className="patient-link">
                                    {`${doctor.lastName}, ${doctor.firstName}`}
                                </Link>
                            </td>
                            <td>{doctor.dateOfBirth}</td>
                              <td className="action-button">
                                <Link to="/update-patients" state={{ doctor }} className="update-btn">Update</Link>
                                <button className="delete-btn" onClick={() => handleDelete(doctor.uid)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
                    <div className="welcome-buttons">
                        <Link to="/data" className="welcome-btn">Data Aggregation</Link>
                    </div>
                </div>
    </>
    );
}

export default AdminWelcome