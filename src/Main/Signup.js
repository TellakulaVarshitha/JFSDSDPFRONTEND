import React, { useState } from 'react'; 
import '../style.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config'

export default function SignUp() {
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    dateofbirth: '',
    gender: '',
    location: '',
    email: '',
    bloodgroup:'',
    contact: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

    if (e.target.id === 'email') {
      if (!e.target.value.endsWith('@gmail.com')) {
        setEmailError('Email must be a Gmail address (gmail.com)');
      } else {
        setEmailError(''); 
      }
    }

    if (e.target.id === 'confirmPassword') {
      if (formData.password && formData.password !== e.target.value) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
    if (e.target.id === 'contact') {
      const contactValue = e.target.value;
      const contactRegex = /^[6-9]\d{9}$/; // Regex for 10 digits starting with 6, 7, 8, or 9
      if (!contactRegex.test(contactValue)) {
        setError('Contact number must start with 6, 7, 8, or 9 and be 10 digits long');
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== document.getElementById("confirmPassword").value) {
      setPasswordError('Passwords do not match');
      setMessage('Please make sure passwords match');
      return;
    }
    if (emailError) {
      setMessage('Please enter a valid Gmail address');
      return;
    }

    try {
      const response = await axios.post(`${config.url}/patientreg`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // Convert JSON data into form data
        }
      });
      setPasswordError('');
      
      if (response.status === 200) {
        setMessage('Registration successful!');
        setFormData({
          name: '',
          dateofbirth: '',
          gender: '',
          location: '',
          email: '',
          bloodgroup:'',
          contact: '',
          password: '',
        });
      }
      setMessage(response.data.message || 'Registration successful!');
      setError('');
      document.getElementById("confirmPassword").value = '';
    } catch (error) {
      if(error.status===500)
      setError("Account already exist")
    else
    setError(error.message)
      setMessage('');
    }
  };

  return (
    <div className="signup-section">
      <div className="signup-wrapper">
        {message && <p className="notification-message">{message}</p>}
        {error && <p className="notification-message">{error}</p>}
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-field">
            <label>Name</label>
            <input type="text" id="name" onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input type="text" id="contact" onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>DOB</label>
            <input type="date" id="dateofbirth" onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Address</label>
            <input type="text" id="location" onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Gender</label>
            <select id="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label>Email</label>
            <input type="email" id="email" onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>BloodGroup</label>
            <input type="text" id="bloodgroup" onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" id="password" onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Confirm Password</label>
            <input type="password" id="confirmPassword" onChange={handleChange} required />
            {passwordError && <p className="notification-message">{passwordError}</p>}
          </div>
          <div className="form-actions">
            <button type="submit">Signup</button>
          </div>
          <p className="signup-prompt">Already have an account?</p>
          <Link to="/login" className="signup-button">Login</Link>
        </form>
      </div>
    </div>
  );
}
