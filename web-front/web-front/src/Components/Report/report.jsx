import React from "react";
import dementia_logo from '../Assets/dementia logo.png'
import './report.css'

const report = () => {
    return(
        <>
        <div className="top-right-container">
            <div className="title">NeuroMind System</div>
            <div className="logo">
                <img src= {dementia_logo} height={50} width={50} alt=""/>
            </div>
        </div>
        <div className="header">
            <div className="text">Reports</div>
        </div>
        </>
    )
}