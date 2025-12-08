import './patient_selection.css'
import {Link, useLocation} from "react-router-dom"
import { useEffect, useState } from 'react'

import { collection, getDocs} from "firebase/firestore"
import { auth, db } from "../../index"
import dementia_logo from '../Assets/dementia logo.png'

const Patient_selection = () => {
    const location = useLocation();
    const lastName = location.state?.lastName || "";

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error("User not logged in");
                const token = await user.getIdToken();

                const response = await fetch("http://localhost:5000/app/patients", {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch patients");

                const data = await response.json();
                setPatients(data);
                }
             catch (err) {
                console.error("Error fetching patients:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return (
        <>
        <div className='ps-top-right-container'>
            <div className='ps-title'>NeuroMind System</div>
            <div className='ps-logo'>
            <img src = {dementia_logo} height={50} width={50} alt="" />
            </div>
        </div>
        <div className="ps-header">
            <div className="ps-text">Hello Dr. {lastName}</div>
        </div>
        <div className="ps-backdrop">
            <div className="ps-table-container">
                <div className="ps-table-title">Patients</div>

                <table className="ps-patient-table">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th>Aggregate Risk</th>
                            <th>Questionnaire Average risk</th>
                            <th>Speech Average risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key ={patient.id}>
                                <td><input type="checkbox"/></td>
                                <td>{patient.name}</td>
                                <td>{patient.dob}</td>
                                <td>{patient.AggregatedRisk*100}%</td>
                                <td>{patient.questionnaireAverageRisk*100}%</td>
                                <td>{patient.voiceAverageRisk*100}%</td>
                            </tr>
                        ))}   
                    </tbody>
                </table>
                        </div>

                <div className="ps-submit-container">
                    <button className="ps-add-btn"> Add Patients</button>
                    <Link to="/welcome" className="dash-link">Go to Dashboard</Link>
                </div>
        </div>
        </>
    )
}

export default Patient_selection