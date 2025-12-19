import React from 'react';
import dementia_logo from '../Assets/dementia logo.png'
import './Welcome.css'
import { useEffect, useState } from 'react'
import { auth } from "../../index";
import { Link, useLocation } from "react-router-dom";

const Welcome = () => {
    const location = useLocation();
    const user = auth.currentUser;
    const lastName = user?.displayName || "";

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this patient?")) {
            console.log(`Patient with id ${id} deleted.`);
        }
    };

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const validatePatient = (data) => {
        console.log("Patient UID =", data.uid);
        console.log("Patient data:", data);
        return {
            uid: data.uid,
            checked: false,
            firstName: (data.firstName && data.firstName !== "") ? data.firstName : "N/A",
            lastName: (data.lastName && data.lastName !== "") ? data.lastName : "N/A",
            dateOfBirth: (data.dateOfBirth && data.dateOfBirth !== "") ? data.dateOfBirth : "N/A",
            averageRisk: (data.averageRisk != null && !isNaN(data.averageRisk)) ? data.averageRisk : 0,
            questionnaireAverageRisk: (data.questionnaireAverageRisk != null && !isNaN(data.questionnaireAverageRisk)) ? data.questionnaireAverageRisk : 0,
            voiceAverageRisk: (data.voiceAverageRisk != null && !isNaN(data.voiceAverageRisk)) ? data.voiceAverageRisk : 0,
        };
    };

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {      
                if (!user) throw new Error("User not logged in");
                const token = await user.getIdToken();

                console.log("Fetching patients for doctor:", user.uid);
                const response = await fetch(`http://localhost:3001/api/web/users/${user.uid}/patients/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                
                if (!response.ok) throw new Error("Failed to fetch patients");

                const data = await response.json();
                console.log("Raw patient data from backend:", data);
                
                const cleanData = (data || []).map(validatePatient);
                console.log("Cleaned patient data:", cleanData);
                setPatients(cleanData);
            }
            catch (err) {
                console.error("Error fetching patients:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [location]); // Re-fetch when location changes (i.e., when navigating back)

    return(
        <>
            <div className="top-right-container">
                <div className='title'>NeuroMind System</div>
                <div className='logo'>
                    <img src={dementia_logo} height={50} width={50} alt="" />
                </div>
            </div>
            <div className="header">
                <div className="text">Welcome Dr. {lastName}</div>
            </div>
            <div className="backdrop">
                <div className="table-container">
                    <h2>Patient Profiles</h2>
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '20px' }}>Loading patients...</p>
                    ) : (
                        <table className="patient-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Date of Birth</th>
                                    <th>Average Risk</th>
                                    <th>Questionnaire Average risk</th>
                                    <th>Speech Average risk</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center" }}>
                                            No patients found.
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map((patient) => (
                                        <tr key={patient.uid}>
                                            <td>
                                                <Link 
                                                    to="/dashboard" 
                                                    state={{ patient }} 
                                                    onClick={() => localStorage.setItem("selectedPatient", JSON.stringify(patient))} 
                                                    className="patient-link"
                                                >
                                                    {`${patient.lastName}, ${patient.firstName}`}
                                                </Link>
                                            </td>
                                            <td>{patient.dateOfBirth}</td>
                                            <td>{(patient.averageRisk * 100).toFixed(1)}%</td>
                                            <td>{(patient.questionnaireAverageRisk * 100).toFixed(1)}%</td>
                                            <td>{(patient.voiceAverageRisk * 100).toFixed(1)}%</td>
                                            <td className="action-button">
                                                <Link to="/update-patients" state={{ patient }} className="update-btn">Update</Link>
                                                <button className="delete-btn" onClick={() => handleDelete(patient.uid)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="welcome-buttons">
                    <Link to="/news" className="welcome-btn">News</Link>
                    <Link to="/data" className="welcome-btn">Data Aggregation</Link>
                </div>
            </div>
        </>
    );
}

export default Welcome