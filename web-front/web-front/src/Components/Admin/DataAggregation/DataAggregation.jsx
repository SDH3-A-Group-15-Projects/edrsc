import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import "./DataAggregation.css";
import { auth } from "../../../utils/firebaseAdminConfig.js";

const DataAggregation = () => {
    const [exportData, setExportData] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = auth.currentUser;

    const flattenObject = (obj, parentKey = "", result = {}) => {
        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) continue;

            const newKey = parentKey ? `${parentKey}_${key}` : key;

            if (
                typeof obj[key] === "object" &&
                obj[key] !== null &&
                !Array.isArray(obj[key])
            ) {
                flattenObject(obj[key], newKey, result);
            } else {
                result[newKey] = obj[key];
            }
        }
        return result;
    };

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

        if (user) fetchExportData();
    }, [user]);

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
                setDoctors(data || []);
                console.log(data);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDoctors();
    }, [user]);

    useEffect(() => {
        const fetchRatings = async () => {
            try {      
                if (!user) throw new Error("User not logged in");
                const token = await user.getIdToken();

                const response = await fetch(`http://localhost:3001/api/admin/ratings/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch ratings");

                const data = await response.json();
                setRatings(data || []);
                console.log(data);
            } catch (err) {
                console.error("Error fetching ratings:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchRatings();
    }, [user]);

    const exportToExcel = () => {

        const flattenedData = exportData.map((item) =>
        flattenObject(item)
    );
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(flattenedData);
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

                <div className="table-container">
                    <h2>Ratings</h2>
                    <table className="doctor-table">
                        <thead>
                            <tr>
                                <th>Rating</th>
                                <th>Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.map((rating) => (
                                <tr key={rating.uid}>
                                    <td>{rating.rating}</td>
                                    <td>{rating.review}</td>
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
