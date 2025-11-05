import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <header className="home-hero">
        <div className="home-hero-content">
          <h1>Welcome to ForeXcure</h1>
          <p>Your 24/7 AI-Powered Health Assistant</p>
          {user ? (
            <Link to="/chatbot" className="button-primary hero-button">
              Go to Symptom Checker
            </Link>
          ) : (
            <Link to="/login" className="button-primary hero-button">
              Get Started
            </Link>
          )}
        </div>
      </header>
      
      <section className="home-features container">
        <h2>How We Can Help You</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <i className="fas fa-robot"></i>
            <h3>AI Symptom Checker</h3>
            <p>Understand your symptoms with our advanced AI chatbot. (Login required)</p>
          </div>
          <div className="feature-card card">
            <i className="fas fa-user-md"></i>
            <h3>Find Doctors</h3>
            <p>Book appointments with specialized doctors from our partner organizations.</p>
          </div>
          <div className="feature-card card">
            <i className="fas fa-capsules"></i>
            <h3>Medical Store</h3>
            <p>Purchase genuine medicines and health products from trusted suppliers.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;