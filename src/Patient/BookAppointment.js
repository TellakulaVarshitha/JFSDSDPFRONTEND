import React, { useState, useEffect } from "react";
import "../style.css";
import axios from "axios";
import config from '../config'

export default function SignUp() {
  
  const [patientData, setPatientData] = useState({});
  const [formData, setFormData] = useState({
    patientid: patientData.id,
    email: patientData.email,
    specalist: "",
    doctorid: "",
    date: "",
    time: "",
  });
  const [message, setMessage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  

  const allSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

    if (e.target.id === "date") {
      fetchAvailableSlots(e.target.value);
    }
  };

  const fetchAvailableSlots = async (date) => {
    // Filter past dates
    if (new Date(date) < new Date()) {
      setMessage("Please select a future date.");
      return;
    }
    else
    setMessage("");

    if (!formData.doctorid) {
      setMessage("Please select a Doctor first.");
      return;
    }

    try {
      const response = await axios.get(
        `${config.url}/viewappointmenttimings?did=${formData.doctorid}&date=${date}`
      );

      if (response.data) {
        filterAvailableSlots(response.data);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setMessage("Failed to load available slots. Please try again.");
    }
  };

  const filterAvailableSlots = (bookedSlots) => {
    if (Array.isArray(bookedSlots)) {
      const available = allSlots.filter((slot) => !bookedSlots.includes(slot));
      setAvailableSlots(available);
    } else {
      console.error("Invalid format for bookedSlots", bookedSlots);
      setMessage("Error: Invalid data for booked slots.");
    }
  };

  const fetchDoctors = async () => {
    if (!formData.specalist) {
      setMessage("Please select a specialization first.");
      return;
    }

    try {
      const response = await axios.get(
        `${config.url}/viewdocbyspecalisation?spec=${formData.specalist}`
      );
      if (response.data) {
        setDoctors(response.data);
        setMessage("");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setMessage("Failed to load doctors. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${config.url}/patientappointment`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data !== "") {
        setMessage("Booking successful!");
        setAvailableSlots((slots) =>
          slots.filter((slot) => slot !== formData.time)
        );
      } else {
        setMessage("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setMessage("An error occurred while booking.");
    }
  };

  useEffect(() => {
    const storedPatientData = localStorage.getItem("patient");
    if (storedPatientData) {
      const parsedPatientData = JSON.parse(storedPatientData);
      setPatientData(parsedPatientData);
    }
  }, []);

  useEffect(() => {
    if (patientData.id) {
      setFormData({
        patientid: patientData.id,
        email: patientData.email,
        specalist: "",
        doctorid: "",
        date: "",
        time: "",
      });
    }
  }, [patientData]);

  return (
    <div className="signup-section">
      <div className="signup-wrapper">
        {message && <p className="notification-message">{message}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-field" hidden>
            <label>Patient ID</label>
            <input
              type="number"
              id="patientid"
              value={patientData.id}
              readOnly
              required
            />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              id="email"
              value={patientData.email}
              readOnly
              required
            />
          </div>
          <div className="form-field">
            <label>Specialist</label>
            <select id="specalist" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="form-field">
            <label>Doctor</label>
            <select
              id="doctorid"
              onClick={fetchDoctors}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Date</label>
            <input
              type="date"
              id="date"
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]} // Disable past dates
            />
          </div>
          <div className="form-field">
            <label>Available Time Slots</label>
            {availableSlots.length > 0 ? (
              <select id="time" onChange={handleChange} required>
                <option value="">Select</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            ) : (
              <p>No available slots. Please select a different date.</p>
            )}
          </div>
          <div className="form-actions">
            <button type="submit">Book</button>
          </div>
        </form>
      </div>
    </div>
  );
}
