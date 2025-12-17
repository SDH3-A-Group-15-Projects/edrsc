import React, { useEffect, useState } from "react"
import * as XLSX from 'xlsx'
import "./DataAggregation.css"

const DataAggregation = () => {
    const [uploadedData, setUploadedData] = useState([]);
    const [exportData, setExportData] = useState([]);

    const sampleTrainingData = [
        { id: 1, age: 72, gender: "F", memoryScore: 42, speechRate: 1.2 },
        { id: 2, age: 68, gender: "M", memoryScore: 57, speechRate: 1.7 },
        { id: 3, age: 75, gender: "F", memoryScore: 36, speechRate: 1.1 },
    ];

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

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(sampleTrainingData);
        XLSX.utils.book_append_sheet(wb,ws, "TrainingData");
        XLSX.writeFile(wb, "anonymised_training_dataset.xlsx");
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = evt.target.result;
            const workbook = XLSX.read(data, {type: "binary" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const json = XLSX.utils.sheet_to_json(sheet);

            setUploadedData(json);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className="aggregation-container">

        <div className="header">
            <div className="text">ML Data Aggregation</div>
        </div>

        <div className="backdrop">
            <div className="report-filter-panel">
                <h3>Download Current Dataset</h3>
                <p>Export anonymised training data.</p>

                <button className="generate-btn" onClick={exportToExcel}>
                    Download Excel (.xlsx)
                </button>
            </div>

            <div className="report-filter-panel">
                <h2>Upload New Data</h2>
                <p>Upload anonymised Excel data to extend the model dataset.</p>

                <input 
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="upload-input"/>
            </div>

            <div className="table-container">
                <h2>Uploaded Data Preview</h2>
                    <table className="report-table">
                        <thead>
                            {uploadedData.length > 0 && (
                            <tr>
                                {Object.keys(uploadedData[0]).map((col) => (
                                    <th key={col}>{col}</th>
    
                            ))}
                            </tr>
                            )}
                        </thead>

                        <tbody>
                            {uploadedData.length == 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: "center"}}>
                                        No data uploaded yet.
                                    </td>
                                </tr>
                            ) : (
                                uploadedData.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((val, i) => (
                                            <td key={i}>{val}</td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default DataAggregation