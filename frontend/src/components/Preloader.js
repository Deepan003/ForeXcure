import React from 'react';
import './Preloader.css';

const Preloader = () => {
  return (
    <div className="preloader-container">
      <div className="preloader-spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Preloader;