import React from "react";
import dementia_logo from '../Assets/dementia logo.png'
import './Welcome.css'
import { Link, useLocation } from "react-router-dom";


const Welcome = () => {
    const location = useLocation();
    const lastName = location.state?.lastName || "";

    const patients = [
        {
            name: "Coleman, Alan",
            dob: "09-04-1983",
            AggregatedRisk: 0.5,
            questionnaireAverageRisk: 0.5,
            voiceAverageRisk: 0.5,
            id: 1,
        },
        {
            name: "Smith, Jane",
            dob: "12-11-1978",
            AggregatedRisk: 0.4,
            questionnaireAverageRisk: 0.6,
            voiceAverageRisk: 0.2,
            id: 2,
        },
        {
            name: "Brown, Michael",
            dob: "03-23-1959",
            AggregatedRisk: 0.7,
            questionnaireAverageRisk: 0.6,
            voiceAverageRisk: 0.8,
            id: 3,
        },
    ];

    return(
    <>
        <div className="top-right-container">
            <div className='title'>NeuroMind System</div>
                <div className='logo'>
                <img src = {dementia_logo} height={50} width={50} alt="" />
                </div>
        </div>
        <div className="header">
            <div className="text">Welcome Dr. {lastName}</div>
        </div>
    <div className="backdrop">
        <div className="table-container">
            <h2>Patient Profiles</h2>
            <table className="patient-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date of Birth</th>
                        <th>Aggregate Risk</th>
                        <th>Questionnaire Average risk</th>
                        <th>Speech Average risk</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>
                                <Link to="/dashboard" state={{ patient }} className="patient-link">
                                    {patient.name}
                                </Link>
                            </td>
                            <td>{patient.dob}</td>
                            <td>{patient.AggregatedRisk*100}%</td>
                            <td>{patient.questionnaireAverageRisk*100}%</td>
                            <td>{patient.voiceAverageRisk*100}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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