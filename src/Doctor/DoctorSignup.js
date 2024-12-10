import React, { useState } from 'react';
import '../style.css';
import config from '../config'

import axios from 'axios';

export default function DoctorSignUp() {
  const [doctor, setDoctor] = useState({
    name: '',
    dateofbirth: '',
    gender: '',
    specialization: '',
    location: '',
    email: '',
    contact: '',
    password: '',
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'image') {
      setImage(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(doctor).forEach((key) => formData.append(key, doctor[key]));
    if (image) formData.append("doctorimage", image);

    try {
      const response = await axios.post(`${config.url}/docreg`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        setMessage(response.data);
        handleReset(); // Reset form values after successful signup
      }
    } catch (error) {
      console.error(error.message);
      setMessage(error.message);
    }
  };

  const handleReset = () => {
    // Resetting state to initial values
    setDoctor({
      name: '',
      dateofbirth: '',
      gender: '',
      specialization: '',
      location: '',
      email: '',
      contact: '',
      password: '',
    });
    setImage(null);
    setMessage('');
  };

  return (
    <div className="signup-section">
      <div className="signup-wrapper">
        {message && <p style={{ color: "red", fontWeight: "bolder" }}>{message}</p>}
        <form onSubmit={handleSubmit} className="signup-form" encType="multipart/form-data">
          <div className="form-field">
            <label>Name</label>
            <input type="text" name="name" onChange={handleChange} value={doctor.name} required />
          </div>
          <div className="form-field">
            <label>DOB</label>
            <input type="date" name="dateofbirth" onChange={handleChange} value={doctor.dateofbirth} required />
          </div>
          <div className="form-field">
            <label>Gender</label>
            <select name="gender" onChange={handleChange} value={doctor.gender} required>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label>Specialization</label>
            <input type="text" name="specialization" onChange={handleChange} value={doctor.specialization} required />
          </div>
          <div className="form-field">
            <label>Location</label>
            <input type="text" name="location" onChange={handleChange} value={doctor.location} required />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} value={doctor.email} required />
          </div>
          <div className="form-field">
            <label>Contact</label>
            <input type="text" name="contact" onChange={handleChange} value={doctor.contact} required />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} value={doctor.password} required />
          </div>
          <div className="form-field">
            <label>Upload Image</label>
            <input type="file" name="image" onChange={handleFileChange} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}></div>
          <button type="submit" className="signup-button">Sign Up</button>
          <button type="button" onClick={handleReset} className="signup-button">Reset</button>
        </form>
      </div>
    </div>
  );
}
