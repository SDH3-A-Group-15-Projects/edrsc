import './patient_selection.css'
import {Link, useLocation, useNavigate} from "react-router-dom"
import { useEffect, useState } from 'react'

import { collection, getDocs} from "firebase/firestore"
import { auth, db } from "../../index"
import dementia_logo from '../Assets/dementia logo.png'

const validatePatient = (data) => {
    return {
        uid: data.uid,
        checked: false,     // Track if checked in UI
        firstName: (data.firstName && data.firstName !== "") ? data.firstName : "N",
        lastName: (data.lastName && data.lastName !== "") ? data.lastName : "/ A",
        dateOfBirth: (data.dateOfBirth && data.dateOfBirth !== "") ? data.dateOfBirth : "N/A",
        averageRisk: (data.averageRisk != null && !isNaN(data.averageRisk)) ? data.averageRisk : 0,
        questionnaireAverageRisk: (data.questionnaireAverageRisk != null && !isNaN(data.questionnaireAverageRisk)) ? data.questionnaireAverageRisk : 0,
        voiceAverageRisk: (data.voiceAverageRisk != null && !isNaN(data.voiceAverageRisk)) ? data.voiceAverageRisk : 0,
    };
};

const Patient_selection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = auth.currentUser;
    const lastName = user.displayName || "";

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const registerPatients = async () => {
        const selectedPatients = patients.filter(patient => patient.checked);

        try {
            for (const patient of selectedPatients) {
                await registerPatient(patient.uid);
            }
            navigate("/welcome");
        } catch (error) {
            console.error("Error registering patients:", error);
            alert("Failed to register selected patients. Please try again.");
            return;
        }
    };

    const registerPatient = async (uid) => {
        if (!user) throw new Error("User not logged in");
        const token = await user.getIdToken();

        try {
            const response = await fetch(`http://localhost:3001/api/web/users/${user.uid}/patients/${uid}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to register patient with UID " + uid);
            }
        } catch (error) {
            throw error;
        }
    };

    const handleCheckboxChange = (uid) => {
        setPatients(prevPatients =>
            prevPatients.map(patient =>
                patient.uid === uid
                    ? { ...patient, checked: !patient.checked }
                    : patient
            )
    );
    };

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = await user.getIdToken();

                const response = await fetch(`http://localhost:3001/api/web/users/${user.uid}/unregistered/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 404) {
                    navigate("/welcome");
                    return;
                } else if (!response.ok) throw new Error("Failed to fetch patients");

                const data = await response.json();
                const cleanData = (data || []).map(validatePatient);
                if (cleanData.length === 0) {
                    navigate("/welcome");
                    return;
                }
                setPatients(cleanData);
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
                            <tr key ={patient.uid}>
                                <td><input type="checkbox" checked={patient.checked} onChange={() => handleCheckboxChange(patient.uid)} /></td>
                                <td>{`${patient.firstName} ${patient.lastName}`}</td>
                                <td>{patient.dateOfBirth}</td>
                                <td>{patient.averageRisk*100}%</td>
                                <td>{patient.questionnaireAverageRisk*100}%</td>
                                <td>{patient.voiceAverageRisk*100}%</td>
                            </tr>
                        ))}   
                    </tbody>
                </table>
                </div>

                <div className="ps-submit-container">
                    <button className="ps-add-btn" onClick={() => registerPatients()}> Add Patients</button>
                    <Link to="/welcome" className="dash-link">Go to Dashboard</Link>
                </div>
        </div>
        </>
    )
}

export default Patient_selection