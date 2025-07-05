import React from "react";
import "./CompareModal.css";
import { motion, AnimatePresence } from "framer-motion";


const CompareModal = ({ satellites, onClose }) => {
  if (!satellites || satellites.length !== 2) return null;

  const [sat1, sat2] = satellites;

  const formatValue = (label, val1, val2) => (
    <tr>
      <td><strong>{label}</strong></td>
      <td className={val1 !== val2 ? "diff" : ""}>{val1 || "N/A"}</td>
      <td className={val1 !== val2 ? "diff" : ""}>{val2 || "N/A"}</td>
    </tr>
  );

    return (
  <AnimatePresence>
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2>🛰️ Satellite Comparison</h2>
        <button className="close-btn" onClick={onClose}>X</button>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>{sat1.name}</th>
              <th>{sat2.name}</th>
            </tr>
          </thead>
          <tbody>
            {formatValue("Agency", sat1.agency, sat2.agency)}
            {formatValue("Orbit Type", sat1.orbitType, sat2.orbitType)}
            {formatValue("Status", sat1.status, sat2.status)}
            {formatValue("Launch Date", sat1.launchDate, sat2.launchDate)}
            {formatValue("Purpose", sat1.purpose, sat2.purpose)}
            {formatValue("Duration", sat1.duration, sat2.duration)}
            {formatValue("Country", sat1.country, sat2.country)}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);
};   
export default CompareModal;
