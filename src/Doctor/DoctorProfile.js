import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './doctorcss/doctorprofile.css'
import config from '../config'

export default function DoctorProfile() {
  const [doctorData, setDoctorData] = useState(null);
  const [doctorImage, setDoctorImage] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    // Get doctor ID from local storage and fetch data as before
    // ...

  }, []);


  useEffect(() => {
    // Get doctor ID from local storage
    const storedDoctorData = localStorage.getItem('doctor');
    if (storedDoctorData) {
      const { id } = JSON.parse(storedDoctorData);

      const fetchDoctorProfile = async () => {
        try {
          // Fetch the doctor profil
          const profileResponse = await axios.get(`${config.url}/doctorprofile/${id}`);
          const doctorProfileData = profileResponse.data;
          setDoctorData(doctorProfileData);

          // Fetch the doctor image based on the doctor ID
          if (doctorProfileData && doctorProfileData.id) {
            const imageResponse = await axios.get(`${config.url}/doctorprofile/image/${doctorProfileData.id}`, {
              responseType: 'arraybuffer', // Ensure we get the image as binary data
            });

            // Use FileReader to convert the binary data to a base64 image string
            const reader = new FileReader();
            reader.onloadend = () => {
              setDoctorImage(reader.result); // Set the base64 string to state
            };
            const blob = new Blob([imageResponse.data], { type: 'image/jpeg' }); // Use correct image type
            reader.readAsDataURL(blob); // Read as base64
          }
        } catch (err) {
          setError('Failed to fetch doctor profile or image. Please try again later.');
          console.error('Error fetching data:', err);
        }
      };

      fetchDoctorProfile();
    }
  }, []);

  return (
    <main className="profile-page">
    <div className="profile-card profile-card-modern">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {doctorData ? (
        <>
          
          {doctorImage && (
            <div>
              
              <img 
                src={doctorImage} 
                alt={`${doctorData.name}`} 
                className='doctor-image'
              />
            </div>
          )}
          <p className="eyebrow">Doctor profile</p>
          <h2>{doctorData.name}</h2>
          <div className="profile-info">
          <p><strong>Doctor ID:</strong> {doctorData.id}</p>
          <p><strong>Specialization:</strong> {doctorData.specialization}</p>
          <p><strong>Email:</strong> {doctorData.email}</p>
          <p><strong>Contact:</strong> {doctorData.contact}</p>
          <p><strong>Experience:</strong> {doctorData.experience} years</p>
          <p><strong>Location:</strong> {doctorData.location}</p>
          </div>
        </>
      ) : (
        <p>Loading doctor profile...</p>
      )}
    </div>
    </main>
  );
}