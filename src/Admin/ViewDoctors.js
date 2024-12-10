import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminNavBar';
// import './ViewDoctors.css';
import config from '../config'

export default function ViewDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`${config.url}/viewdoctors`);
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchDoctors();
  }, []);

  const handleStatus = async (email, status) => {
    try {
      const response = await axios.put(`${config.url}/updatedocstatus?email=${email}&status=${status}`);
      alert(response.data); // Show success message from the server

      // Update the doctor status in the local state
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor.email === email ? { ...doctor, status: status } : doctor
        )
      );
    } catch (error) {
      console.error("Error updating doctor status:", error.message);
    }
  };

  return (
    <div className="upcoming-appointments">
      <div className="view-appointments">
        <h1>Doctors List</h1>
        <div className="appointments-header">
        <span>Total Doctors: {doctors.length}</span>
      </div>
        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <div className='table-container'>
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Doctor Name</th>
                <th>Date Of Birth</th>
                <th>Gender</th>
                <th>Specialization</th>
                <th>Location</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Password</th>
                <th>Action</th>
                
              </tr>
            </thead>
            <tbody>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>{doctor.id}</td>
                    <td>{doctor.name}</td>
                    <td>{doctor.dateofbirth}</td>
                    <td>{doctor.gender}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.location}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.contact}</td>
                    <td>{doctor.status}</td>
                   
                    <td>{doctor.password}</td>
                    <td>
                      <button className='accept-button' onClick={() => handleStatus(doctor.email, 'Accepted')}>Accept</button>
                      <button className='reject-button'  onClick={() => handleStatus(doctor.email, 'Rejected')}>Reject</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" align="center">No doctors found</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
