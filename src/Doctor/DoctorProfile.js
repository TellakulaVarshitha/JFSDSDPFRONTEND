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

    // Create moving balls
    const ballContainer = document.createElement('div');
    ballContainer.classList.add('background-container');
    document.body.appendChild(ballContainer);

    for (let i = 0; i < 20; i++) {
      const ball = document.createElement('div');
      ball.classList.add('ball');
      ballContainer.appendChild(ball);
    }

    // Script for tracking mouse movement
    const moveBalls = (e) => {
      const balls = document.querySelectorAll('.ball');
      balls.forEach((ball) => {
        const x = e.clientX - ball.offsetWidth / 7;
        const y = e.clientY - ball.offsetHeight / 2;
        ball.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    document.addEventListener('mousemove', moveBalls);

    // Cleanup event listener and elements on component unmount
    return () => {
      document.removeEventListener('mousemove', moveBalls);
      document.body.removeChild(ballContainer);
    };
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
    <div className="profile-card">
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
          <p><strong>Doctor ID:</strong> {doctorData.id}</p>
          <p><strong>Full Name:</strong> {doctorData.name}</p>
          <p><strong>Specialization:</strong> {doctorData.specialization}</p>
          <p><strong>Email:</strong> {doctorData.email}</p>
          <p><strong>Contact:</strong> {doctorData.contact}</p>
          <p><strong>Experience:</strong> {doctorData.experience} years</p>
          <p><strong>Location:</strong> {doctorData.location}</p>
        </>
      ) : (
        <p>Loading doctor profile...</p>
      )}
    </div>
  );
}