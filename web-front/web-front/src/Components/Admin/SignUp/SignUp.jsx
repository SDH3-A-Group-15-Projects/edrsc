import React, { useState } from 'react'
import './SignUp.css'

import email_icon from '../../Assets/email icon.png'
import password_icon from '../../Assets/password icon.png'
import dementia_logo from '../../Assets/dementia logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { registerNewUser } from '../../../utils/adminCreateAccountWithEmail.js'


const AdminSignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await registerNewUser(email, password);

      navigate('/admin/data');
    } catch (err) {
      console.error("Signup error:", err);
      alert("Sign-up failed. Check console for details.");
    }
  };
  
  return (
    <>
      <div className='top-right-container'>
        <div className='title'>NeuroMind System</div>
        <div className='logo'>
          <img src={dementia_logo} height={50} width={50} alt="" />
        </div>
      </div>

      <div className='container'>
        <div className="header">
          <div className="text">Create an Account</div>
          <div className="underline"></div>
          <div className='signInLink'>
            Already have an account? <Link to='/login'>Sign in</Link>
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

          <div className="submit" onClick={handleSignUp}>Sign Up</div>
        </div>
    </>
  )
}

export default AdminSignUp
