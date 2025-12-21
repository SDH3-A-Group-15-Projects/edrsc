import React from "react";
import dementia_logo from '../Assets/dementia logo.png';
import './Risk_Dashboard.css';
import { useLocation, useNavigate } from "react-router-dom";
import RiskDashboardChat from "../RiskDashboardChat/RiskDashboardChat";
import { useEffect } from "react";
import { useState } from "react";
import { auth } from "../../firebaseConfig";

const Risk_Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = auth.currentUser;
    const patientFromStorage = localStorage.getItem("selectedPatient");
    let initialPatient = location.state?.patient || (patientFromStorage ? JSON.parse(patientFromStorage) : null);
    const [patient, setPatient] = useState(initialPatient);
    const [supportRequests, setSupportRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!patient || !patient.uid) {
            alert("No patient selected. Redirecting to Welcome page.");
            navigate("/welcome");
        }
    }, [patient, navigate]);

    useEffect(() => {
        const fetchSupport= async () => {
            try {      
                if (!user) throw new Error("User not logged in");
                const token = await user.getIdToken();

                const response = await fetch(`http://localhost:3001/api/support/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch patients");

                const data = await response.json();
                const filteredData = data.filter(request => request.uid === patient.uid);
                setSupportRequests(filteredData);
                }
                catch (err) {
                console.error("Error fetching patients:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSupport();
        }, []);  

    const handleGoToReport = async () => {
        if (!patient || !patient.uid) {
            alert("No patient data available");
            return;
        }

        setLoading(true);

        try {

            const checkResponse = await fetch(
                `http://localhost:3001/api/web/payments/check/${patient.uid}`
            );
            const checkData = await checkResponse.json();

            if (checkData.paid) {

                const reportResponse = await fetch(
                    `http://localhost:3001/api/report/patient/${patient.uid}`
                );
                
                if (!reportResponse.ok) throw new Error("Failed to fetch report");
                
                const patientData = await reportResponse.json();
                navigate("/report", { state: { patient: patientData } });
                return;
            }

            const response = await fetch(
                "http://localhost:3001/api/web/payments/create-checkout-session",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ patientId: patient.uid }),
                }
            );

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Payment failed");
            
            window.location.assign(data.url);
        } catch (err) {
            console.error("Error:", err);
            alert(err.message || "Failed to process request");
            setLoading(false);
        }
    };

    return (
        <>
            <div className="top-right-container">
                <div className='title'>NeuroMind System</div>
                <div className='logo'>
                    <img src={dementia_logo} height={50} width={50} alt="NeuroMind Logo" />
                </div>
            </div>

            <div className="header">
                <div className="text">Risk Dashboard</div>
            </div>

            <div className="backdrop">
                <div className="info-wrapper">
                    {patient ? (
                        <>
                            <div className="patient-info-section">
                                <table className="patient-info-table">
                                    <thead>
                                        <tr>
                                            <th colSpan="2" className="patient-name">
                                                <p>{patient.firstName} {patient.lastName}</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Questionnaire</strong></td>
                                            <td>{patient.questionnaireAverageRisk}%</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Speech</strong></td>
                                            <td>{patient.voiceAverageRisk}%</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Average Risk</strong></td>
                                            <td>{patient.averageRisk}%</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="patient-side-info">
                                    <p className="patient-details-text">
                                        Scored a {patient.averageRisk}% in Assessment.
                                    </p>
                                    <div className="report-button-wrapper">
                                        <button 
                                            className="report-button" 
                                            onClick={handleGoToReport}
                                            disabled={loading}
                                        >
                                            {loading ? "Processing..." : "Go to Report"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="table-container">
                            <h2>Patient Support Requests</h2>
                            <table className="patient-table">
                                <thead>
                                    <tr>
                                        <th>Date Submitted</th>
                                        <th>Status</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supportRequests.map((req) => (
                                        <tr key={req.uid}>
                                            <td>{new Date(req.dateSubmitted).toISOString()}</td>
                                            <td>{req.status}</td>
                                            <td>{req.message.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                            <RiskDashboardChat patient={patient} />
                        </>
                    ) : (
                        <p>No patient selected</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Risk_Dashboard;