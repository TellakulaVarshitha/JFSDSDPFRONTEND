import React, { useEffect, useState } from 'react';
import axios from 'axios'; // For API requests
import './doctorcss/patienthome.css';
import { Bar } from 'react-chartjs-2'; // For the chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import config from '../config'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper function to generate chart data
const generateBarChartData = (appointments) => {
  const dateCounts = {};

  appointments.forEach((appointment) => {
    const date = new Date(appointment.date).toLocaleDateString(); // Convert to readable date format
    if (dateCounts[date]) {
      dateCounts[date]++;
    } else {
      dateCounts[date] = 1;
    }
  });

  return {
    labels: Object.keys(dateCounts), // Dates
    datasets: [
      {
        label: 'Number of Appointments',
        data: Object.values(dateCounts), // Counts
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };
};

export default function DoctorHome() {
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch doctor data from localStorage
    const storedDoctorData = localStorage.getItem('doctor');
    if (storedDoctorData) {
      setDoctorData(JSON.parse(storedDoctorData));
    } else {
      window.location.href = '/login'; // Redirect to login if no doctor data
    }
  }, []);

  // Fetch all appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (doctorData) {
          const response = await axios.get(
            `${config.url}/docappointments?docid=${doctorData.id}`
          );
          setAppointments(response.data);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [doctorData]);

  // Filter today's appointments and generate bar chart data
  useEffect(() => {
    if (appointments.length > 0) {
      const today = new Date().toLocaleDateString(); // Today's date in local format
      const filteredAppointments = appointments.filter(
        (appointment) => new Date(appointment.date).toLocaleDateString() === today
      );

      setTodaysAppointments(filteredAppointments);
      setChartData(generateBarChartData(appointments));
    }
  }, [appointments]);

  return (
    <div className="doctor-home">
      {/* Top-left welcome message */}
      {doctorData && (
        <div className="welcome-container">
          <p className="welcome-message">Welcome Dr. {doctorData.name}</p>
        </div>
      )}

      {/* Main dashboard content */}
      <div className="dashboard">
        {/* Bar graph of patient bookings */}
        <div className="bar-graph">
          <h3>Patient Bookings by Date</h3>
          {chartData ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true },
                  title: {
                    display: true,
                    text: 'Number of Appointments per Date',
                  },
                },
              }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>

        {/* Today's appointments displayed at the bottom-left */}
        <div className="appointments-list">
          <h3>Today's Scheduled Appointments</h3>
          {todaysAppointments.length > 0 ? (
            <ul>
              {todaysAppointments.map((appointment) => (
                <li key={appointment.id}>
                  <p>
                    <strong>Patient:</strong> {appointment.email}
                  </p>
                  <p>
                    <strong>Time:</strong> {appointment.time}
                  </p>
                  <p>
                    <strong>Status:</strong> {appointment.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointments scheduled for today.</p>
          )}
        </div>
      </div>
    </div>
  );
}
