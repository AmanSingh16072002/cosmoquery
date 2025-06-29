import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
// import SatelliteDetails from "./components/SatelliteDetails"; // If missing, leave it commented

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {/* <Route path="/satellite/:id" element={<SatelliteDetails />} /> */}
    </Routes>
  );
}

export default App;
