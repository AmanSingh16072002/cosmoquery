import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Footer from './components/Footer';
// import SatelliteDetails from "./components/SatelliteDetails"; // Optional

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/satellite/:id" element={<SatelliteDetails />} /> */}
      </Routes>
    </Router>
  );
}



export default App;
