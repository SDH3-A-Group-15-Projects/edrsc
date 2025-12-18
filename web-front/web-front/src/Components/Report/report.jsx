import React, { useEffect, useState } from "react";
import dementia_logo from "../Assets/dementia logo.png";
import "./report.css";
import { db } from "../../index";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";


const Reports = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [reportList, setReportList] = useState([]);
    const navigate = useNavigate();
    const [paymentVerified, setPaymentVerified] = useState(false);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/web/payment/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ patientId: 'GLOBAL_REPORT_ACCESS', }),
                });

            const data = await response.json();

            if (data.paid) {
                setPaymentVerified(true);
            } else {
                navigate('/risk-dashboard');
            }
        } catch (error) {
            console.error("Payment verification error:", error);
            navigate('/risk-dashboard');
        }
    };

        verifyPayment();
    }, [navigate]);
            
    // Load patient data
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const database = getDatabase();
                const snapshot = await get(ref(database, "patients"));

                if (snapshot.exists()) {
                    const data = snapshot.val();

                    const patientData = Object.entries(data).map(([id, value]) => ({
                        id,
                        ...value,
                    }));
            setPatients(patientData);
                } else {
                    setPatients([]);
                }
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
        };
        fetchPatients();
    }, []);

    // Generate report entry
    const generateReport = () => {
        if (!selectedPatient) return;

        const patientInfo = patients.find((p) => p.id === selectedPatient);

        const agg = patientInfo.AggregatedRisk;

        const newReport = {
            id: Date.now(),
            patientId: patientInfo.id,
            name: patientInfo.name,
            date: new Date().toLocaleDateString(),
            aggregate: `${(agg * 100).toFixed(1)}%`,
            questionnaire: `${(patientInfo.questionnaireAverageRisk * 100).toFixed(1)}%`,
            voice: `${(patientInfo.voiceAverageRisk * 100).toFixed(1)}%`,
            riskLevel:
                agg > 0.7 ? "High" :
                agg > 0.4 ? "Medium" : "Low"
        };

        setReportList((prev) => [...prev, newReport]);
    };

    // Generate PDF
    const downloadPDF = (report) => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Patient Cognitive Report", 10, 20);

        doc.setFontSize(12);
        doc.text(`Patient: ${report.name}`, 10, 40);
        doc.text(`Date: ${report.date}`, 10, 50);
        doc.text(`Aggregate Risk: ${report.aggregate}`, 10, 70);
        doc.text(`Questionnaire Risk: ${report.questionnaire}`, 10, 80);
        doc.text(`Speech Risk: ${report.voice}`, 10, 90);
        doc.text(`Risk Level: ${report.riskLevel}`, 10, 100);

        doc.text("Clinician Summary:", 10, 120);
        doc.text(
            report.riskLevel === "High"
                ? "High cognitive risk detected. Recommend urgent follow-up."
                : report.riskLevel === "Medium"
                ? "Moderate risk identified. Continued monitoring advised."
                : "Low risk. Routine check-up recommended.",
            10,
            130,
            { maxWidth: 180 }
        );

        doc.save(`report_${report.name}.pdf`);
    };

    if ( !paymentVerified ) {
            return null;
        }

    return (
        <>
            <div className="top-right-container">
                <div className="title">NeuroMind System</div>
                <div className="logo">
                    <img src={dementia_logo} height={50} width={50} alt="" />
                </div>
            </div>

            <div className="header">
                <div className="text">Reports</div>
            </div>

            <div className="backdrop">

                {/* Report Generator */}
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
                                <th>Download</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reportList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>
                                        No reports generated yet.
                                    </td>
                                </tr>
                            ) : (
                                reportList.map((rep) => (
                                    <tr key={rep.id}>
                                        <td>{rep.name}</td>
                                        <td>{rep.date}</td>
                                        <td>{rep.aggregate}</td>
                                        <td>{rep.riskLevel}</td>
                                        <td>
                                            <button
                                                className="download-btn"
                                                onClick={() => downloadPDF(rep)}
                                            >
                                                PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
};

export default Reports;
