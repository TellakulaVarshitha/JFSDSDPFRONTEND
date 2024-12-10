import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config'

export default function PatientHome() {
  const [patientData, setPatientData] = useState("");
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [allAppointments, setAllAppointments] = useState([]); // Store all appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState([]); // Filtered upcoming appointments
  const [error, setError] = useState("");

  useEffect(() => {
    const storedPatientData = localStorage.getItem('patient');
    if (storedPatientData) {
      const parsedPatientData = JSON.parse(storedPatientData);
      setPatientData(parsedPatientData);
    }
  }, []);

  useEffect(() => {
    if (patientData && patientData.id) {
      const fetchAppointments = async () => {
        try {
          const response = await axios.get(`${config.url}/viewappointments?pid=${patientData.id}`);
          console.log(response.data)
          setAllAppointments(response.data || []); // Store all appointments
          setAppointmentsCount(response.data.length); // Set total appointment count
        } catch (error) {
          setError('Failed to fetch appointments');
        }
      };

      fetchAppointments();
    }
  }, [patientData]);

  useEffect(() => {
    if (allAppointments.length > 0) {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      const upcoming = allAppointments.filter(appt => {
        const appointmentTime = new Date(appt.time); // Convert appointment time to Date object
        return appointmentTime >= now && appointmentTime <= oneHourLater;
      });
     
      setUpcomingAppointments(upcoming); // Set filtered appointments
    }
  }, [allAppointments]); // Re-run this effect when allAppointments changes

  return (
    <div>
      {patientData ? (
        <div>
          <h4 style={{ color: 'blue', fontSize: '24px', fontWeight: 'bold', textAlign: 'center', margin: 90 }}>
            Welcome {patientData.name}
          </h4>

          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px' }}>
              Total Appointments: <strong>{appointmentsCount}</strong>
            </p>
          </div>

          {upcomingAppointments.length > 0 && (
            <div style={{ backgroundColor: '#ffeb3b', padding: '10px', borderRadius: '5px', margin: '20px auto', width: '80%' }}>
              <h5 style={{ color: '#333', textAlign: 'center' }}>You have an appointment in the next hour!</h5>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {upcomingAppointments.map((appt, index) => (
                  <li key={index} style={{ padding: '5px 0' }}>
                    <strong>Time:</strong> {new Date(appt.time).toLocaleTimeString()} | <strong>Doctor:</strong> {appt.doctorName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : error ? (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
