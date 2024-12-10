import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../style.css';
import { useNavigate } from 'react-router-dom';
import config from '../config'

export default function DoctorLogin({ onDoctorLogin }) {
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const activeLogin = location.pathname;

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.url}/doclogin`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data) {
        const status = response.data.status;

        if (status === 'Accepted') {
          onDoctorLogin();
          localStorage.setItem('doctor', JSON.stringify(response.data));
          navigate('/doctorhome');
        } else if (status === 'Registered') {
          setMessage('Your registration is under verification by admin.');
          setError('');
        } else if (status === 'Rejected') {
          setMessage('Your application was rejected by the admin.');
          setError('');
        } else {
          setMessage('Unexpected status returned. Please contact support.');
          setError('');
        }
      } else {
        setMessage('');
        setError('Incorrect email or password.');
      }
    } catch (err) {
      setMessage('');
      setError('An error occurred. Please try again.');
      console.error('Error during login:', err);
    }
  };

  return (
    <div className="login-page">
      <section className="login-section">
        <div className="login-content">
          {/* Displaying the message or error */}
          {message && <h4 align="center" style={{ color: "red" }}>{message}</h4>}
          {error && <h4 align="center" style={{ color: "red" }}>{error}</h4>}

          {/* Toggle buttons for different login types */}
          <div className="toggle-buttons">
            <Link to="/login" className={`toggle-button patient-login ${activeLogin === '/login' ? 'active' : ''}`}>Patient</Link>
            <Link to="/doctorlogin" className={`toggle-button doctor-login ${activeLogin === '/doctorlogin' ? 'active' : ''}`}>Doctor</Link>
            <Link to="/adminlogin" className={`toggle-button admin-login ${activeLogin === '/adminlogin' ? 'active' : ''}`}>Admin</Link>
            <div className="toggle-selector"></div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                id="email"
                onChange={handleChange}
                required
                value={data.email}
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                id="password"
                onChange={handleChange}
                required
                value={data.password}
              />
            </div>
            <button type="submit" className="submit-button">Login</button>
            <p className="signup-prompt">Don't have an account?</p>
            <Link to="/doctorsignup" className="signup-button">Signup</Link>
          </form>
        </div>
      </section>
    </div>
  );
}
