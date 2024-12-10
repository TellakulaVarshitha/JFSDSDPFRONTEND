import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../style.css';
import { useNavigate } from 'react-router-dom';
import config from '../config'

export default function Login({onPatientLogin}) {
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const [message,setMessage]=useState("")
  const [error,setError]=useState("")

  const location = useLocation();
  const activeLogin = location.pathname;  

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.url}/patientlogin`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // to convert json data into form data
        },
      });
  
      console.log(response.data);
  
      if (response.data !== "") {
        onPatientLogin();
        console.log(response.data);
        
        // Store patient data in localStorage
        localStorage.setItem('patient', JSON.stringify(response.data));
        
        navigate("/patienthome");
      } else {
        // Display the error message if credentials are incorrect
        setMessage("Incorrect email or password");
        setError("");
      }
    } catch (error) {
      setMessage("");
      setError(error.message);
    }
  };
  
  return (
    <div className="login-page">
      
      <section className="login-section">
        <div className="login-content">
        {
         message ? <h4 align="center" style={{color:"red"}}>{message}</h4> : <h4 align="center" style={{color:"red"}}>{error}</h4>
      }
          
          <div className="toggle-buttons">
          <Link to="/login" className={`toggle-button patient-login ${activeLogin === '/login' ? 'active' : ''}`}>Patient</Link>
              
              <Link to="/doctorlogin" className={`toggle-button doctor-login ${activeLogin === '/doctorlogin' ? 'active' : ''}`}>Doctor</Link>
              
              <Link to="/adminlogin" className={`toggle-button admin-login ${activeLogin === '/adminlogin' ? 'active' : ''}`}>Admin</Link>
            <div className="toggle-selector"></div>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
          
      
            <div className="form-group">
              <label>Email:</label>
              <input type="email" id='email' onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input type="password" id='password' onChange={handleChange} required />
            </div>
            <button type="submit" className="submit-button">
              Login
            </button>
            <p className="signup-prompt">Don't have an account?</p>
            <Link to="/signup" className="signup-button">Signup</Link>
          </form>
        </div>
      </section>
    </div>
  );
}
