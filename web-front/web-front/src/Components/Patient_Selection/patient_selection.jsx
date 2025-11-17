import './patient_selection.css'
import {Link, useLocation} from "react-router-dom"


import dementia_logo from '../Assets/dementia logo.png'

const Patient_selection = () => {
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