import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container container">
      <h1>Welcome, {user.name}!</h1>
      <p>Your role is: <strong>{user.role}</strong></p>

      {user.role === 'Patient' && (
        <div className="dashboard-patient card">
          <h2>Patient Dashboard</h2>
          <p>Here you will be able to see your upcoming appointments and order history.</p>
          {/* We will build this out next */}
        </div>
      )}

      {user.role === 'Organisation' && (
        <div className="dashboard-org card">
          <h2>Organisation Dashboard</h2>
          <p>Here you will be able to add doctors and medical store products.</p>
          {/* We will build this out next */}
          <div className="org-actions">
             <button className="button-primary">Add New Doctor</button>
             <button className="button-primary">Add New Product</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;