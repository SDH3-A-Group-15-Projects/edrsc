import React, { useState } from "react";
import dementia_logo from "../Assets/dementia logo.png";
import "./report.css";
import { useLocation } from "react-router-dom";

const Reports = () => {
    const location = useLocation();
    const lastName = location.state?.lastName || "";

    const patients = [
        { id: 1, name: "Coleman, Alan" },
        { id: 2, name: "Smith, Jane" },
        { id: 3, name: "Brown, Michael" }
    ];

    const [selectedPatient, setSelectedPatient] = useState("");
    const [reportList, setReportList] = useState([]);

    const generateReport = () => {
        if (!selectedPatient) return;

        const patientInfo = patients.find(p => p.id === selectedPatient);

        const newReport = {
            id: Date.now(),
            name: patientInfo.name,
            date: new Date().toLocaleDateString(),
            risk: "Medium",
            aggregate: "55%",
        };

        setReportList([...reportList, newReport]);
    };

    return (
        <>
            {/* Top Bar */}
            <div className="top-right-container">
                <div className="title">NeuroMind System</div>
                <div className="logo">
                    <img src={dementia_logo} height={50} width={50} alt="" />
                </div>
            </div>

            {/* Header */}
            <div className="header">
                <div className="text">Reports</div>
            </div>

            {/* Backdrop */}
            <div className="backdrop">

                {/* Filter Panel */}
                <div className="report-filter-panel">
                    <h3>Generate New Report</h3>

                    <div className="filter-row">
                        <label>Patient:</label>
                        <select
                            value={selectedPatient}
                            onChange={(e) => setSelectedPatient(e.target.value)}
                        >
                            <option value="">Select Patient</option>
                            {patients.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-row">
                        <label>Report Type:</label>
                        <select>
                            <option>Full Summary</option>
                            <option>Cognitive Breakdown</option>
                            <option>Trend Analysis</option>
                            <option>Questionnaire vs Voice Comparison</option>
                        </select>
                    </div>

                    <button className="generate-btn" onClick={generateReport}>
                        Generate Report
                    </button>
                </div>

                {/* Report Table */}
                <div className="table-container">
                    <h2>Generated Reports</h2>

                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Date</th>
                                <th>Aggregate Risk</th>
                                <th>Risk Level</th>
                                <th>View</th>
                                <th>Download</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reportList.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>
                                        No reports generated yet.
                                    </td>
                                </tr>
                            )}

                            {reportList.map((rep) => (
                                <tr key={rep.id}>
                                    <td>{rep.name}</td>
                                    <td>{rep.date}</td>
                                    <td>{rep.aggregate}</td>
                                    <td>{rep.risk}</td>
                                    <td>
                                        <button className="view-btn">View</button>
                                    </td>
                                    <td>
                                        <button className="download-btn">PDF</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
};

export default Reports;
