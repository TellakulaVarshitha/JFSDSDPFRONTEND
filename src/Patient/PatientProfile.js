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
        <div className="profile-card">
          <div className="profile-icon">
            {/* Show patient image if available, otherwise default icon */}
            {imageSrc ? (
              <div
              style={{
                position: 'relative',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                overflow: 'hidden', // Keeps the image in a circle
                display: 'inline-block',
              }}
            >
              <img
                src={imageSrc} className='profile_image'
                alt="Profile" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Ensures the image fits the circle
                }}
              />
            
              {/* Pencil icon for changing the image */}
              <button
                onClick={() => fileInputRef.current.click()} // Trigger file input click when pencil is clicked
                className="pencil-icon"
              >
                <i
                  className="fas fa-pencil-alt"
                  style={{
                    fontSize: '30px',
                    color: 'black',
                  }}
                ></i>
              </button>
            </div>
            ) : (
              <div className="default-profile-icon">👤</div>
            )}
          </div>

          {/* File input (hidden by default) */}
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the file input field
          />

          {/* Display "Choose Image" button if no image is present */}
          {!imageSrc && (
            <div>
              <button
                onClick={() => fileInputRef.current.click()} // Trigger file input click
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Choose Image
              </button>
            </div>
          )}

          {/* Display messages */}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Patient Details */}
          <h2>{patientData.name}</h2>
          <div className="profile-info">
            <p><span>Gender:</span> {patientData.gender}</p>
            <p><span>Date of Birth:</span> {patientData.dateofbirth}</p>
            <p><span>Email:</span> {patientData.email}</p>
            <p><span>Contact:</span> {patientData.contact}</p>
            <p><span>Address:</span> {patientData.location}</p>
          </div>
        </div>
      ) : (
        <p>Loading patient data...</p>
      )}
    </div>
  );
}
