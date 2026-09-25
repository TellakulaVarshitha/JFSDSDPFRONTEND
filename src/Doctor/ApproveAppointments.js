import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './doctorcss/upcomingappointments.css';
import config from '../config'

const ApproveAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patientNames, setPatientNames] = useState({});

  // Get doctor ID from localStorage
  const storedDoctorData = localStorage.getItem('doctor');
  const docid = storedDoctorData ? JSON.parse(storedDoctorData).id : null;

  useEffect(() => {
    if (docid) {
      axios
        .get(`${config.url}/docappointments?docid=${docid}`)
        .then(async (response) => {
          const now = new Date();

          // Filter to include only future appointments
          const futureAppointments = response.data.filter((appointment) => {
            const [year, month, day] = appointment.date.split('-').map(Number); // Split date as YYYY-MM-DD
            const [hour, minute] = appointment.time.split(':').map(Number); // Split time as HH:mm

            const appointmentDateTime = new Date(year, month - 1, day, hour, minute);

            return appointmentDateTime > now;
          });

          setAppointments(futureAppointments);

          const patientIds = [...new Set(futureAppointments.map((appointment) => appointment.patientid))];
          const patientResponses = await Promise.all(
            patientIds.map((id) => axios.get(`${config.url}/viewdocpatients?id=${id}`))
          );
          const namesById = {};
          patientResponses.forEach((patientResponse) => {
            const patients = Array.isArray(patientResponse.data)
              ? patientResponse.data
              : [patientResponse.data];
            patients.forEach((patient) => {
              if (patient && patient.id) {
                namesById[patient.id] = patient.name;
              }
            });
          });
          setPatientNames(namesById);
        })
        .catch((error) => console.error('Error fetching appointments:', error));
    }
  }, [docid]);

  const updateAppointmentStatus = (group, status) => {
    const appointmentIds = group.map((appointment) => appointment.id);

    Promise.all(
      appointmentIds.map((id) =>
        axios.post(`${config.url}/updateappointmentstatus?id=${id}&status=${status}`)
      )
    )
      .then(() => {
        alert(`Appointment${appointmentIds.length > 1 ? 's' : ''} ${status.toLowerCase()} successfully.`);
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointmentIds.includes(appointment.id)
              ? { ...appointment, status }
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
  const groupedAppointments = Object.values(
    pendingAppointments.reduce((groups, appointment) => {
      const groupKey = `${appointment.date}_${appointment.time}`;
      if (!groups[groupKey]) {
        groups[groupKey] = { date: appointment.date, time: appointment.time, appointments: [] };
      }
      groups[groupKey].appointments.push(appointment);
      return groups;
    }, {})
  );

  return (
    <div className="upcoming-appointments">
      <h1>Upcoming Appointments</h1>
      <div className="table-container">
        {groupedAppointments.length > 0 ? (
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
              {groupedAppointments.map((group) => (
                <tr key={`${group.date}_${group.time}`}>
                  <td className="stacked-values">
                    {group.appointments.map((appointment) => (
                      <span key={appointment.id}>{appointment.id}</span>
                    ))}
                  </td>
                  <td className="stacked-values">
                    {group.appointments.map((appointment) => (
                      <span key={appointment.id}>
                        {patientNames[appointment.patientid] || appointment.patientid}
                      </span>
                    ))}
                  </td>
                  <td className="stacked-values">
                    {group.appointments.map((appointment) => (
                      <span key={appointment.id}>{appointment.date}</span>
                    ))}
                  </td>
                  <td className="stacked-values">
                    {group.appointments.map((appointment) => (
                      <span key={appointment.id}>{appointment.time}</span>
                    ))}
                  </td>
                  <td className="stacked-values">
                    {group.appointments.map((appointment) => (
                      <span key={appointment.id}>{appointment.email}</span>
                    ))}
                  </td>
                  <td className="stacked-values">
                    {group.appointments.map((appointment) => (
                      <span key={appointment.id}>{appointment.fees}</span>
                    ))}
                  </td>
                  <td className="stacked-values">
                    {group.appointments.map((appointment) => (
                      <div className="appointment-action-row" key={appointment.id}>
                        <button
                          className="accept-button"
                          onClick={() => updateAppointmentStatus([appointment], 'Accepted')}
                        >
                          Accept
                        </button>
                        <button
                          className="reject-button"
                          onClick={() => updateAppointmentStatus([appointment], 'Rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    ))}
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
