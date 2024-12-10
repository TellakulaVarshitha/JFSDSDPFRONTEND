import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminNavBar';
//import './ViewPatient.css';
import config from '../config'

export default function ViewPatients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${config.url}/viewpatients`);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error.message);
      }
    };

    fetchPatients();
  }, []); // Removed patientId as a dependency since it's not used in the effect

  

  return (
    <div className="upcoming-appointments">
      <div className="view-appointments">
        <h1>Patients List</h1>
        <div className="appointments-header">
        <span>Total Patients: {patients.length}</span>
      </div>
        <div className='table-container'>
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Date Of Birth</th>
              <th>Gender</th>
              <th>Location</th>
              
              <th>Email</th>
              <th>Contact</th>
              <th>Password</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.dateofbirth}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.location}</td>
                 
                  <td>{patient.email}</td>
                  <td>{patient.contact}</td>
                  <td>{patient.password}</td>
                  {/* <td>
                      <button onClick={() => handleDelete(patient.id)}>Delete</button>
                     
                    </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" align="center">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
