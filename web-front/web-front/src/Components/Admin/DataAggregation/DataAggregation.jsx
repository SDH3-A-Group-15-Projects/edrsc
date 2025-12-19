import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import "./DataAggregation.css";
import { auth } from "../../../utils/firebaseAdminConfig.js";

const DataAggregation = () => {
    const [exportData, setExportData] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = auth.currentUser;

    useEffect(() => {
        const fetchExportData = async () => {
            try {
                const token = await user.getIdToken();

                const response = await fetch(`http://localhost:3001/api/admin/export`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 404) {
                    setExportData([]);
                    return;
                } else if (!response.ok) throw new Error("Failed to fetch export data");
                const data = await response.json();
                setExportData(data || []);
                console.log(data);
            } catch (err) {
                console.error("Error fetching export data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExportData();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {      
                if (!user) throw new Error("User not logged in");
                const token = await user.getIdToken();

                const response = await fetch(`http://localhost:3001/api/admin/doctors/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch doctors");

                const data = await response.json();
                setDoctors(data);
                console.log(data);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, "TrainingData");
        XLSX.writeFile(wb, "anonymised_training_dataset.xlsx");
    };

    return (
        <div className="aggregation-container">

            <div className="header">
                <div className="text">ML Data Aggregation</div>
            </div>

            <div className="backdrop">

                <div className="table-container">
                    <h2>Doctor Profiles</h2>
                    <table className="doctor-table">
                        <thead>
                            <tr>
                                <th>UID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>No. of Patients</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor) => (
                                <tr key={doctor.uid}>
                                    <td>{doctor.uid}</td>
                                    <td>{doctor.firstName}</td>
                                    <td>{doctor.lastName}</td>
                                    <td>{doctor.noOfPatients}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="report-filter-panel">
                    <h3>Download Current Dataset</h3>
                    <p>Export anonymised training data.</p>

                    <button className="generate-btn" onClick={exportToExcel}>
                        Download Excel (.xlsx)
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DataAggregation;
