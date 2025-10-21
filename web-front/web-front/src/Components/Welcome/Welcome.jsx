import React from "react";
import dementia_logo from '../Assets/dementia logo.png'
import './Welcome.css'


const Welcome = () => {
    return(
    <>
        <div className="top-right-container">
            <div className='title'>NeuroMind System</div>
                <div className='logo'>
                <img src = {dementia_logo} height={50} width={50} alt="" />
                </div>
        </div>
    <div className="backdrop">
        <div className="info-wrapper">
            <div className="left-container">
                <h1>Name</h1>
                <label>
                <input type="checkbox" name="Coleman, Alan" value="Coleman, Alan" />
                Coleman, Alan
                </label>
            </div>
            <div className="middle-container">
                <h1>Date of Birth</h1>
                <p>09-04-1983</p>
            </div>
            <div className="right-container">
                <h1>Medication</h1>
                <p>Donepezil</p>
            </div>
        </div>
        <div className="submit-container">
        <div className="submit">View Profiles</div>
        </div>
    </div>
    </>
    );
}

export default Welcome