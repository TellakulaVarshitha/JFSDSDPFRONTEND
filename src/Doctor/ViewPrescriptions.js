import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './viewprescriptions.css'; // Importing CSS file
import config from '../config';

export default function ViewPrescriptions() {
  const [appointmentId, setAppointmentId] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState('');
  const [doctorId, setDoctorId] = useState('');

  // Retrieve doctorId from session storage when the component mounts
  useEffect(() => {
    const storedDoctorId = sessionStorage.getItem('doctorId');
    if (storedDoctorId && !isNaN(parseInt(storedDoctorId, 10))) {
      setDoctorId(storedDoctorId);
    } else {
      console.error('Doctor ID is missing or invalid.');
      setError('Doctor ID is missing or invalid.');
    }
  }, []);

  // Log doctorId after it is set
  useEffect(() => {
    if (doctorId) {
      console.log(`Doctor ID: ${doctorId}`);
    }
  }, [doctorId]);

  const handleInputChange = (e) => {
    setAppointmentId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate appointmentId
    if (!appointmentId || isNaN(parseInt(appointmentId, 10))) {
      setError('Invalid appointment ID');
      return;
    }

    try {
      const response = await axios.get(
        `${config.url}/viewprescriptions/${appointmentId}`
      );
      console.log(response.data);

      if (Array.isArray(response.data)) {
        setPrescriptions(response.data);
      } else {
        setPrescriptions([]);
        setError(response.data); // Display returned error message if not an array
      }
    } catch (err) {
      setError('Error fetching prescriptions. Please try again.');
      console.error(err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="view-prescriptions-container">
      <h1>View Prescriptions</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <label htmlFor="appointmentId">Appointment ID:</label>
        <input
          type="text"
          id="appointmentId"
          value={appointmentId}
          onChange={handleInputChange}
          required
        />
        <button type="submit">View</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {prescriptions.length > 0 ? (
        <div>
          <h2>Prescriptions:</h2>
          <ul className="prescription-message">
            {prescriptions.map((prescription, index) => (
              <li key={index}>{prescription}</li>
            ))}
          </ul>
        </div>
      ) : (
        !error &&
        appointmentId && (
          <div className="data-message">No prescriptions found for this appointment.</div>
        )
      )}
    </div>
  );
}
