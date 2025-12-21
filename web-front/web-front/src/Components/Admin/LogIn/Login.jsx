import React, { useState } from "react";
import './LogIn.css'

import email_icon from '../../Assets/email icon.png'
import password_icon from '../../Assets/password icon.png'
import dementia_logo from '../../Assets/dementia logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail } from "../../../utils/adminLogInWithEmail.js";

const AdminLogIn = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please fill in both email and password.");
            return;
        }

        try {
            await loginWithEmail(email, password);

            navigate("/admin/data");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid email or password.")
        }
    };

    return (
    <>
        <div className='top-right-container'>
              <div className='title'>NeuroMind System</div>
              <div className='logo'>
                <img src = {dementia_logo} height={50} width={50} alt="" />
              </div>
            </div>
        
        <div className="container">
            <div className="header">
                <div className="text">Admin Log In</div>
                <div className="underline"></div>
                <div className='signUpLink'>
                Need an Account? <Link to="/admin/">Sign up</Link>
                </div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} height={25} width={25} alt="" />
                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="input">
                    <img src={password_icon} height={25} width={25} alt="" />
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
        </div>
        

        <div className="submit" onClick={handleLogin}>Log In</div>

      </div>
    </>
    )
}

export default AdminLogIn