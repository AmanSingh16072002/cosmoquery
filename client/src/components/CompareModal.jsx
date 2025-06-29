import React from "react";
import "./CompareModal.css"; // You’ll add styling soon

const CompareModal = ({ satellites, onClose }) => {
  if (satellites.length !== 2) return null;

  const [sat1, sat2] = satellites;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Satellite Comparison</h2>
        <div className="comparison-table">
          <div className="row header">
            <div>Property</div>
            <div>{sat1.name}</div>
            <div>{sat2.name}</div>
          </div>
          <div className="row">
            <div>Launch Date</div>
            <div>{sat1.launchDate}</div>
            <div>{sat2.launchDate}</div>
          </div>
          <div className="row">
            <div>Status</div>
            <div>{sat1.status}</div>
            <div>{sat2.status}</div>
          </div>
          <div className="row">
            <div>Orbit Type</div>
            <div>{sat1.orbitType}</div>
            <div>{sat2.orbitType}</div>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CompareModal;