import React, { useState } from "react";
import './resetPassword.css'

import email_icon from '../Assets/email icon.png'
import dementia_logo from '../Assets/dementia logo.png'
import { Link } from "react-router-dom";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = () => {
    const auth = getAuth();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async () => {
        if (!email) {
            setMessage("Please enter your email.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Email sent, Check your inbox");
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <>
            <div className="top-right-container">
                <div className="title">Neuromind System</div>
                <div className="logo">
                    <img src= {dementia_logo} height={50} width={50} alt="" />
                </div>
            </div>

        <div className="container">
            <div className="header">
                <div className="text">Reset your Password</div>
                <div className="underline"></div>
                <div className="signupLink">
                    Need an Account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} height={25} width={25} alt="" />
                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
        </div>

        <div className="submit-container">
            <button className="submit" onClick={handleReset}>Send Email</button>
        </div>

        {message && <p className="message">{message}</p>}
        </div>
        </>
    );
};

export default ResetPassword