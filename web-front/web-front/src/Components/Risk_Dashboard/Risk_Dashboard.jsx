import React from "react";
import dementia_logo from '../Assets/dementia logo.png'
import './Risk_Dashboard.css'
import { useLocation, useNavigate } from "react-router-dom";

const Risk_Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const patient = location.state?.patient;
    const doctor = location.state?.doctor;

    const handleGoToReport = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/api/web/payments/create-checkout-session`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        doctorId: doctor.id,
                }),
    });

    const data = await response.json();

    if (data.paid) {
        navigate('/report', { state: { patient } });
    } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
    }
} catch (error) {
    console.error("Payment error:", error);
    alert("Payment process failed. Please try again.");
}
    };

    return(
    <>
        <div className="top-right-container">
            <div className='title'>NeuroMind System</div>
                <div className='logo'>
                <img src = {dementia_logo} height={50} width={50} alt="" />
                </div>
        </div>
        <div className="header">
            <div className="text">Risk Dashboard</div>
        </div>
    <div className="backdrop">
        <div className="info-wrapper">
            { patient ? (
                <div className="patient-info-section">
                <table className="patient-info-table">
                    <thead>
                        <tr>
                        <th colSpan="2" className="patient-name">
                    <p>{patient.name}</p>
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                    <td><strong>Memory </strong></td>
                    <td>60%</td>
                        </tr>
                        <tr>
                    <td><strong>Attention </strong></td>
                    <td>50%</td>
                    </tr>
                    <tr>
                    <td><strong>Executive Function </strong></td>
                    <td>55%</td>
                    </tr>
                    <tr>
                    <td><strong>Processing Speed </strong></td>
                    <td>45%</td>
                    </tr>
                    </tbody>
                </table>

                <div className="patient-side-info">
                    <p className="patient-details-text">
                        Scored a 50% in Assessment, Patient is at a medium risk
                        for cognitive decline
                    </p>
                    <div className="report-button-wrapper">
                    <button className="report-button" onClick={handleGoToReport}>
                        Go to Report
                    </button>
                    </div>
                </div>
            </div>
            ) : (
                <p>No patient selected</p>
            )}
        </div>
    </div>
    </>
    );
};

export default Risk_Dashboard;