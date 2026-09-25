import React, { useEffect, useState, useRef } from 'react';
import './Patientcss/Patient.css';
import axios from 'axios';
import config from '../config'

export default function PatientProfile() {
  const [patientData, setPatientData] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    file: null,
  });
  const fileInputRef = useRef(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch and set patient data from localStorage on mount
  useEffect(() => {
    const storedPatientData = localStorage.getItem('patient');
    if (storedPatientData) {
      const parsedPatientData = JSON.parse(storedPatientData);
      setPatientData(parsedPatientData);
      setImageSrc(`${config.url}/displaypatientimage?id=${parsedPatientData.id}`);
    }
  }, []);

  // Handle file input change for image upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData({ ...formData, file: selectedFile }); // Store the selected file in state

    // After file is selected, automatically trigger the upload
    handleUpload(selectedFile);
  };

  // Handle image upload
  const handleUpload = async (file) => {
    if (!file) return; // If no file is provided, don't upload

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', patientData.id);
      formDataToSend.append('file', file); // Send the file in the request

      const response = await axios.post(`${config.url}/uploadimage`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
       
        setError('');
        // Update image source after successful upload to reflect the new image
        setImageSrc(`${config.url}/displaypatientimage?id=${patientData.id}&timestamp=${Date.now()}`);

        // Clear the file input and form data after upload
       
        fileInputRef.current.value = '';
        setFormData({ ...formData, file: null });
      }
    } catch (error) {
      setError('Error uploading image');
      setMessage(''); // Clear success message on error
    }
  };

  return (
    <div>
      {patientData ? (
        <main className="profile-page">
        <div className="profile-card profile-card-modern">
          <div className="profile-icon">
            {/* Show patient image if available, otherwise default icon */}
            {imageSrc ? (
              <div className="profile-photo">
              <img
                src={imageSrc} className='profile_image'
                alt="Profile"
              />
            </div>
            ) : (
              <div className="default-profile-icon">👤</div>
            )}
          </div>

          <div className="picture-actions">
            <button
              onClick={() => fileInputRef.current.click()}
              className="picture-button"
              aria-label="Add profile picture"
            >
              Add picture
            </button>
          </div>

          {/* File input (hidden by default) */}
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the file input field
          />

          {/* Display messages */}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Patient Details */}
          <p className="eyebrow">Patient profile</p>
          <h2>{patientData.name}</h2>
          <div className="profile-info">
            <p><span>Gender:</span> {patientData.gender}</p>
            <p><span>Date of Birth:</span> {patientData.dateofbirth}</p>
            <p><span>Email:</span> {patientData.email}</p>
            <p><span>Contact:</span> {patientData.contact}</p>
            <p><span>Address:</span> {patientData.location}</p>
          </div>
        </div>
        </main>
      ) : (
        <p>Loading patient data...</p>
      )}
    </div>
  );
}
