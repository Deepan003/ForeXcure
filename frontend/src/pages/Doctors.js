import React, { useState, useEffect } from 'react';
import Preloader from '../components/Preloader';
import './Doctors.css';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  return (
    <div className="doctors-container container">
      <h1>Find a Doctor</h1>
      {loading ? (
        <Preloader />
      ) : (
        <div className="doctors-grid">
          {doctors.map(doc => (
            <div key={doc.id} className="doctor-card card">
              <img src={doc.image} alt={doc.name} className="doctor-image" />
              <h3>{doc.name}</h3>
              <p className="doctor-specialty">{doc.specialty}</p>
              <p className="doctor-bio">{doc.bio}</p>
              <p className="doctor-org">Hospital: {doc.org}</p>
              <button className="button-primary">Book Appointment</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Doctors;