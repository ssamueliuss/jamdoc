import React from 'react';
import './LoadingSpinner.css';
import logo from '../assets/logo.png';

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <img src={logo} alt="Logo" className="spinner-logo" />
    <div className="spinner" />
  </div>
);

export default LoadingSpinner;
