import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './doctorcss/upcomingappointments.css';
import config from '../config'

const ApproveAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Get doctor ID from localStorage
  const storedDoctorData = localStorage.getItem('doctor');
  const docid = storedDoctorData ? JSON.parse(storedDoctorData).id : null;

  useEffect(() => {
    if (docid) {
      axios
        .get(`${config.url}/docappointments?docid=${docid}`)
        .then((response) => {
          const now = new Date();

          // Filter to include only future appointments
          const futureAppointments = response.data.filter((appointment) => {
            const [year, month, day] = appointment.date.split('-').map(Number); // Split date as YYYY-MM-DD
            const [hour, minute] = appointment.time.split(':').map(Number); // Split time as HH:mm

            const appointmentDateTime = new Date(year, month - 1, day, hour, minute);

            return appointmentDateTime > now;
          });

          setAppointments(futureAppointments);
        })
        .catch((error) => console.error('Error fetching appointments:', error));
    }
  }, [docid]);

  const handleAccept = (id) => {
    axios
      .post(`${config.url}/updateappointmentstatus?id=${id}&status=Accepted`)
      .then(() => {
        alert('Appointment accepted successfully.');
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === id
              ? { ...appointment, status: 'Accepted' }
              : appointment
          )
        );
      })
      .catch((error) => console.error('Error updating appointment status:', error));
  };

  const handleReject = (id) => {
    axios
      .post(`${config.url}/updateappointmentstatus?id=${id}&status=Rejected`)
      .then(() => {
        alert('Appointment rejected successfully.');
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === id
              ? { ...appointment, status: 'Rejected' }
              : appointment
          )
        );
      })
      .catch((error) => console.error('Error updating appointment status:', error));
  };

  // Filter appointments to show only "Doctor Approval Pending" status
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === 'Doctor Approval Pending'
  );

  return (
    <div className="upcoming-appointments">
      <h1>Upcoming Appointments</h1>
      <div className="table-container">
        {pendingAppointments.length > 0 ? (
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Email</th>
                <th>Fee Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patientid}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.email}</td>
                  <td>{appointment.fees}</td>
                  <td>
                    <button
                      className="accept-button"
                      onClick={() => handleAccept(appointment.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleReject(appointment.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-appointments">No appointments found.</div>
        )}
      </div>
    </div>
  );
};

export default ApproveAppointments;
