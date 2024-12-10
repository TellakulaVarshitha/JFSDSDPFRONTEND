import React, { useState } from 'react';
import axios from 'axios';
//import './prescriptionform.css';
import config from '../config'

export default function PrescriptionForm({ appointmentId, onClose }) {
  const [prescription, setPrescription] = useState(''); // State to store prescription input

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from reloading the page

    try {
      // Make GET request to send appointment ID and prescription to the backend
      const response = await axios.get(`
        ${config.url}/addprescription/${appointmentId}/${encodeURIComponent(prescription)}`
      );

      if (response.status === 200) {
        alert(response.data); // Display success message from backend
        setPrescription(''); // Clear prescription input after submission
        onClose(); // Close the form after submission
      } else {
        alert('Failed to submit prescription');
      }
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('An error occurred while submitting the prescription');
    }
  };

  return (
    <div className="prescription-form">
      <div className="form-content">
        <button className="close" onClick={onClose}>&times;</button> {/* Close button */}
        <h3>Add Prescription</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Prescription:
            <textarea
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Enter the prescription details"
              required
            />
          </label>
          <button type="submit">Submit Prescription</button>
        </form>
      </div>
    </div>
  );
}