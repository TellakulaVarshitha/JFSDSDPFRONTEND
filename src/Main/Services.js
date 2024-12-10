import React from 'react';
import '../style.css'; 

export default function Home() {
    const services = [
        { title: "General Surgery", description: "High-quality surgical services by expert doctors." },
        { title: "Cardiology", description: "Advanced heart care and treatment." },
        { title: "Pediatrics", description: "Comprehensive care for children." },
        { title: "Orthopedics", description: "Bone and joint treatments." },
        { title: "Gynecology", description: "Women's health and maternity services." },
        { title: "Dermatology", description: "Skin care and cosmetic treatments." }
    ];

    return (
        <div className="services-container">
            <h1>Our Services</h1>
            <div className="service-row">
                {services.map((service, index) => (
                    <div className="service-card" key={index}>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
