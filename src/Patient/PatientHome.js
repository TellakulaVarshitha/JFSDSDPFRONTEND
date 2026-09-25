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
    <main className="patient-home">
      {patientData ? (
        <>
          <section className="patient-welcome">
            <div>
              <p className="eyebrow">Patient overview</p>
              <h1>Welcome, {patientData.name}</h1>
              <p>Keep track of your care, appointments, and next steps from one place.</p>
            </div>
            <div className="patient-avatar">{patientData.name?.charAt(0).toUpperCase()}</div>
          </section>
          <section className="patient-summary-grid">
            <div className="summary-card summary-card-primary"><span>Total appointments</span><strong>{appointmentsCount}</strong><small>All bookings</small></div>
            <div className="summary-card"><span>Upcoming today</span><strong>{upcomingAppointments.length}</strong><small>Next hour</small></div>
            <div className="summary-card"><span>Care status</span><strong>Active</strong><small>Account in good standing</small></div>
          </section>
          <section className="patient-next-card">
            <div><p className="eyebrow">Next on your schedule</p><h2>{upcomingAppointments.length ? 'Appointment reminder' : 'Nothing scheduled right now'}</h2></div>
            {upcomingAppointments.length > 0 ? <ul>{upcomingAppointments.map((appt, index) => <li key={index}><strong>{new Date(appt.time).toLocaleTimeString()}</strong><span>{appt.doctorName || 'Your care team'}</span></li>)}</ul> : <p className="empty-copy">Book an appointment when you are ready to plan your next visit.</p>}
          </section>
        </>
      ) : error ? <p className="dashboard-error">{error}</p> : <p className="dashboard-loading">Loading your dashboard...</p>}
    </main>
  );
}
