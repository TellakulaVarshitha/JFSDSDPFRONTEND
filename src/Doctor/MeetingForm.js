import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './doctorcss/email.css';
import config from '../config'

export default function MeetingForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const email = location.state?.email || '';

  const [formData, setFormData] = useState({
    name: '',
    email: email,
    link: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        `${config.url}/sendemail`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      if(response!==null)
      setMessage('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Failed to send email. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: email,
      link: '',
    });
    setMessage('');
    setError('');
  };

  return (
    <div className="meeting-form-section">
      {message && <p className="notification-message success">{message}</p>}
      {error && <p className="notification-message error">{error}</p>}

      <form onSubmit={handleSubmit} className="meeting-form">
        <div className="form-field">
          <label htmlFor="name">Enter Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={formData.email}
            readOnly
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="link">Enter Link</label>
          <input
            type="text"
            id="link"
            value={formData.link}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">Send</button>
          <button type="button" onClick={handleReset}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
