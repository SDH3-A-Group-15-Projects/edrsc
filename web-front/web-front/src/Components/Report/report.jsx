import React, { useState, useEffect } from "react";
import dementia_logo from "../Assets/dementia logo.png";
import "./report.css";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";

const Reports = () => {
    const [reportList, setReportList] = useState([]);
    const location = useLocation();
    const patientFromNav = location.state?.patient;

    
    useEffect(() => {
        if (patientFromNav && patientFromNav.profile) {
            const agg = patientFromNav.results?.averageRisk || 0;
            
            const newReport = {
                id: Date.now(),
                patientId: patientFromNav.profile.uid || "N/A",
                name: `${patientFromNav.profile.firstName} ${patientFromNav.profile.lastName}`,
                date: new Date().toLocaleDateString(),
                aggregate: `${(agg * 100).toFixed(1)}%`,
                questionnaire: `${((patientFromNav.results?.questionnaireAverageRisk || 0) * 100).toFixed(1)}%`,
                voice: `${((patientFromNav.results?.voiceAverageRisk || 0) * 100).toFixed(1)}%`,
                riskLevel:
                    agg > 0.7 ? "High" :
                    agg > 0.4 ? "Medium" : "Low",
                riskFactors: patientFromNav.riskFactors || {}
            };

            setReportList([newReport]);
        }
    }, [patientFromNav]);

  
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

    return (
        <div className="reports-page">
           
            <header className="reports-header">
                <img src={dementia_logo} alt="Logo" className="logo" />
                <div className="system-name">NeuroMind System</div>
            </header>

            
            <h1 className="reports-title">Generated Reports</h1>

            <div className="reports-container">
                {reportList.length === 0 ? (
                    <div className="no-reports">No reports generated yet.</div>
                ) : (
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
                            {reportList.map((rep) => (
                                <tr key={rep.id}>
                                    <td>{rep.name}</td>
                                    <td>{rep.date}</td>
                                    <td>{rep.aggregate}</td>
                                    <td className={`risk-${rep.riskLevel.toLowerCase()}`}>
                                        {rep.riskLevel}
                                    </td>
                                    <td>
                                        <button
                                            className="download-btn"
                                            onClick={() => downloadPDF(rep)}
                                        >
                                            PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Reports;
