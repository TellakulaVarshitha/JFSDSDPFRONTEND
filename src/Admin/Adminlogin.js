import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../style.css';
import { useNavigate } from 'react-router-dom';
import config from '../config'

export default function AdminLogin({ onAdminLogin }) {
  const [data, setData] = useState({
    username: "",
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
     
      const response = await axios.post(`${config.url}/adminlogin`, data);
     
      if (response.data) {
        onAdminLogin();

        // Store admin data in localStorage
        localStorage.setItem('admin', JSON.stringify(response.data));

        // Navigate to admin home page
        navigate("/adminhome");
      } else {
        setMessage("Incorrect Username or Password");
        setError("");
      }
    } catch (err) {
      setMessage("");
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <section className="login-section">
        <div className="login-content">
          {/* Display error or message */}
          {message && <h4 align="center" style={{ color: "red" }}>{message}</h4>}
          {error && <h4 align="center" style={{ color: "red" }}>{error}</h4>}

          <div className="toggle-buttons">
            {/* Navigation links with active state */}
            <Link to="/login" className={`toggle-button patient-login ${activeLogin === '/login' ? 'active' : ''}`}>
              Patient
            </Link>
            <Link to="/doctorlogin" className={`toggle-button doctor-login ${activeLogin === '/doctorlogin' ? 'active' : ''}`}>
              Doctor
            </Link>
            <Link to="/adminlogin" className={`toggle-button admin-login ${activeLogin === '/adminlogin' ? 'active' : ''}`}>
              Admin
            </Link>
            <div className="toggle-selector"></div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                id="username"
                value={data.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                id="password"
                value={data.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
