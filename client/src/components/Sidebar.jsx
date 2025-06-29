// src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>CosmoQuery</h2>
      <ul>
        <li>Dashboard</li>
        <li>Satellites</li>
        <li>Launches</li>
        <li>AstroData</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
