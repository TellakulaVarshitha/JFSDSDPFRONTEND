import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import '../admincss/adminhome.css'
import config from '../config'

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminHome() {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [registeredCount, setRegisteredCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${config.url}/viewdoctors`);

        const acceptedDoctors = response.data.filter(
          (doctor) => doctor.status === "Accepted"
        );
        const rejectedDoctors = response.data.filter(
          (doctor) => doctor.status === "Rejected"
        );
        const registeredDoctors = response.data.filter(
          (doctor) => doctor.status === "Registered"
        );

        setAcceptedCount(acceptedDoctors.length);
        setRejectedCount(rejectedDoctors.length);
        setRegisteredCount(registeredDoctors.length);

        setLoading(false);

        if (registeredDoctors.length > 0) {
          setNotification(
            `You have ${registeredDoctors.length} doctor(s) waiting for acceptance or rejection.`
          );
        } else {
          setNotification("");
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsResponse = await axios.get(
          `${config.url}/totalapp`
        );
        setTotalAppointments(appointmentsResponse.data);

        const doctorsResponse = await axios.get(`${config.url}/totaldoc`);
        setTotalDoctors(doctorsResponse.data);

        const patientResponse = await axios.get(
          `${config.url}/totalpatient`
        );
        setTotalPatients(patientResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ["Accepted", "Rejected", "Registered"],
    datasets: [
      {
        data: [acceptedCount, rejectedCount, registeredCount],
        backgroundColor: ["green", "red", "yellow"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="admin-home-container">
      <h1>Admin Home</h1>
      {loading ? (
        <p>Loading doctors...</p>
      ) : (
        <>
          {notification && (
            <div className="notification">
              <p>{notification}</p>
            </div>
          )}

          {/* Dashboard summary */}
          <div className="dashboard">
            <div className="admin-appointments-list">
              <h3>Total Appointments</h3>
              <p>{totalAppointments}</p>
            </div>
            <div className="admin-appointments-list2">
              <h3>Total Doctors</h3>
              <p>{totalDoctors}</p>
            </div>
            <div className="admin-appointments-list3">
              <h3>Total Patients</h3>
              <p>{totalPatients}</p>
            </div>
          </div>

          {/* Pie chart */}
          <div className="pie-chart-container">
            {/* <h4>Doctor Status Overview</h4> */}
            <Pie data={data} />
          </div>
        </>
      )}
    </div>
  );
}
