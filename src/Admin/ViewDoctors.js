import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import config from '../config'

export default function ViewDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedStatus = searchParams.get('status');
  const selectedStatus = ['accepted', 'rejected', 'pending'].includes(requestedStatus)
    ? requestedStatus
    : 'accepted';
  const statusByView = {
    accepted: 'Accepted',
    rejected: 'Rejected',
    pending: 'Registered',
  };
  const visibleDoctors = doctors.filter(
    (doctor) => doctor.status === statusByView[selectedStatus]
  );

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
        <h1>{selectedStatus === 'pending' ? 'Pending Doctors' : `${selectedStatus[0].toUpperCase()}${selectedStatus.slice(1)} Doctors`}</h1>
        <nav className="doctor-status-menu" aria-label="Doctor status">
          {['accepted', 'rejected', 'pending'].map((status) => (
            <button
              key={status}
              type="button"
              className={selectedStatus === status ? 'active' : ''}
              aria-current={selectedStatus === status ? 'page' : undefined}
              onClick={() => setSearchParams({ status })}
            >
              {status === 'pending' ? 'Pending Doctors' : `${status[0].toUpperCase()}${status.slice(1)} Doctors`}
            </button>
          ))}
        </nav>
        <div className="appointments-header">
        <span>Total Doctors: {visibleDoctors.length}</span>
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
                {selectedStatus === 'pending' && <th>Action</th>}
                
              </tr>
            </thead>
            <tbody>
              {visibleDoctors.length > 0 ? (
                visibleDoctors.map((doctor) => (
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
                    {selectedStatus === 'pending' && (
                      <td>
                        <div className="appointment-actions">
                          <button className='accept-button' onClick={() => handleStatus(doctor.email, 'Accepted')}>Accept</button>
                          <button className='reject-button' onClick={() => handleStatus(doctor.email, 'Rejected')}>Reject</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={selectedStatus === 'pending' ? 10 : 9} align="center">No {selectedStatus} doctors found</td>
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
