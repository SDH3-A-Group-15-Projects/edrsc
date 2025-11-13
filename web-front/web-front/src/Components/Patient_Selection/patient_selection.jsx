import React, {useState} from "react"
import './patient_selection.css'
import {Link, useLocation} from "react-router-dom"


import dementia_logo from '../Assets/dementia logo.png'

const Patient_selection = () => {
    const location = useLocation();
    const lastName = location.state?.lastName || "";

    return (
        <>
        <div className='top-right-container'>
            <div className='title'>NeuroMind System</div>
            <div className='logo'>
            <img src = {dementia_logo} height={50} width={50} alt="" />
            </div>
        </div>
        <div className="header">
            <div className="text">Hello Dr. {lastName}</div>
        </div>
        <div className="backdrop">
            <div className="table-container">
                <h2>Patients</h2>

                <table className="patient-table">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th>Medication</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="checkbox" /></td>
                            <td>John Doe</td>
                            <td>12-03-1985</td>
                            <td>Metformin</td>
                        </tr>
                        <tr>
                            <td><input type="checkbox"/></td>
                            <td>Paul Smith</td>
                            <td>19-05-1992</td>
                            <td>N/A</td>
                        </tr>
                    </tbody>
                </table>

                <div className="button-container">
                    <button className="add-button"> Add Patients</button>
                    <Link to="/risk-dashboard" className="dash-link">Go to Dashboard</Link>
                </div>
            </div>
        </div>
        </>
    )
}

export default Patient_selection