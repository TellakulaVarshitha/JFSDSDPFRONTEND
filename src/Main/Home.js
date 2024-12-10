import React from 'react';
import { Link } from 'react-router-dom';
import '../style.css';


export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
        <h1 style={{ color: 'white' }}>Welcome to Soul Medic Hospital</h1>
          <p>Committed to Compassionate, Quality Care</p>
          <Link to="/login" className="cta-button">Book Appointment</Link>
        </div>
      </section>
     

      {/* Contact Details Section */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>For appointments, inquiries, or assistance, please reach out:</p>
        <div className="contact-details" >
          <p><strong>Address:</strong> 123 Health Avenue, Wellness City, WS 56789</p>
          <p><strong>Phone:</strong> (123) 456-7890</p>
          <p><strong>Email:</strong> contact@soulmedic.com</p>
          <p><strong>Hours:</strong> Mon - Fri: 8:00 AM - 8:00 PM, Sat - Sun: 9:00 AM - 5:00 PM</p>
        </div>
      </section>
    </div>
  );
}
