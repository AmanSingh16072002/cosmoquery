import React, { useState, useEffect } from "react";
import { getSatellites } from "../services/satelliteService";
import "./Dashboard.css";
import OrbitTypeChart from "./OrbitTypeChart";
import CompareModal from "./CompareModal";
import {
  PieChart, Pie, Tooltip, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

const Dashboard = () => {
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [satellites, setSatellites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orbitFilter, setOrbitFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [agencyFilter, setAgencyFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSatellites, setSelectedSatellites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("name-asc");

  const handleResetFilters = () => {
    setSearchTerm("");
    setOrbitFilter("All");
    setStatusFilter("All");
    setAgencyFilter("All");
    setSortBy("name-asc");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sats = await getSatellites();
        setSatellites(sats);
        setError(null);
      } catch (err) {
        console.error("Error fetching satellites:", err);
        setError("Failed to load satellite data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSatellites = satellites.filter((sat) => {
    const matchesSearch = sat.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrbit = orbitFilter === "All" || sat.orbitType === orbitFilter;
    const matchesStatus = statusFilter === "All" || sat.status === statusFilter;
    const matchesAgency = agencyFilter === "All" || sat.agency === agencyFilter;
    return matchesSearch && matchesOrbit && matchesStatus && matchesAgency;
  });

  const uniqueAgencies = ["All", ...new Set(satellites.map(sat => sat.agency).filter(Boolean))];

  const sortedSatellites = [...filteredSatellites].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "launchDate-asc":
        return new Date(a.launchDate) - new Date(b.launchDate);
      case "launchDate-desc":
        return new Date(b.launchDate) - new Date(a.launchDate);
      default:
        return 0;
    }
  });

  const toggleSelectSatellite = (satellite) => {
    const exists = selectedSatellites.find((s) => s.id === satellite.id);
    if (exists) {
      setSelectedSatellites(selectedSatellites.filter((s) => s.id !== satellite.id));
    } else if (selectedSatellites.length < 2) {
      setSelectedSatellites([...selectedSatellites, satellite]);
    }
  };

  const COLORS = ['#00bcd4', '#ff9800', '#4caf50', '#e91e63'];
  const chartData = [
    { name: 'LEO', value: filteredSatellites.filter(s => s.orbitType === 'LEO').length },
    { name: 'MEO', value: filteredSatellites.filter(s => s.orbitType === 'MEO').length },
    { name: 'GEO', value: filteredSatellites.filter(s => s.orbitType === 'GEO').length },
  ];

  const agencyCounts = filteredSatellites.reduce((acc, sat) => {
    const agency = sat.agency || "Unknown";
    acc[agency] = (acc[agency] || 0) + 1;
    return acc;
  }, {});

  const agencyChartData = Object.entries(agencyCounts).map(([agency, count]) => ({
    name: agency,
    count,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(sortedSatellites.length / itemsPerPage);
  const paginatedSatellites = sortedSatellites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  return (
    <div className="dashboard-container">
      <h2>Satellite Dashboard</h2>
      <p>Total Satellites: {satellites.length}</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search satellites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="launchDate-asc">Launch Date (Oldest)</option>
          <option value="launchDate-desc">Launch Date (Newest)</option>
        </select>
        <button className="reset-button" onClick={handleResetFilters}>Reset Filters</button>
        <select value={orbitFilter} onChange={(e) => setOrbitFilter(e.target.value)}>
          <option value="All">All Orbits</option>
          <option value="LEO">LEO</option>
          <option value="MEO">MEO</option>
          <option value="GEO">GEO</option>
          <option value="HEO">HEO</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Decommissioned">Decommissioned</option>
        </select>
        <select value={agencyFilter} onChange={(e) => setAgencyFilter(e.target.value)}>
          {uniqueAgencies.map((agency) => (
            <option key={agency} value={agency}>{agency}</option>
          ))}
        </select>
        {selectedSatellites.length === 2 && (
          <button className="compare-button" onClick={() => setShowModal(true)}>Compare Selected</button>
        )}
      </div>

      {loading && <div className="loader"></div>}
      {error && <p className="error-text">{error}</p>}

      <div className="satellite-list">
        {paginatedSatellites.map((sat) => (

          <div
            className={`satellite-card ${selectedSatellites.some(s => s.id === sat.id) ? "selected" : ""}`}
            key={sat.id}
            onClick={() => setSelectedSatellite(sat)}
          >
            <h3>{sat.name}</h3>
            <p><strong>Launch Date:</strong> {sat.launchDate}</p>
            <p><strong>Status:</strong> {sat.status}</p>
            <p><strong>Orbit Type:</strong>
              {sat.orbitType === 'LEO' && <> 🛰️ LEO</>}
              {sat.orbitType === 'MEO' && <> 🪐 MEO</>}
              {sat.orbitType === 'GEO' && <> 🌍 GEO</>}
              {sat.orbitType === 'HEO' && <> 🚀 HEO</>}
            </p>
            <p><strong>Agency:</strong> {sat.agency || "Unknown"}</p>
            <button
              className="select-button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSelectSatellite(sat);
              }}
            >
              {selectedSatellites.some(s => s.id === sat.id) ? "Deselect" : "Select"}
            </button>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>


      <div className="chart-section">
        <h3>Satellites by Orbit Type</h3>
        <PieChart width={300} height={300}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <h3>Satellites by Agency</h3>
      <BarChart
        layout="vertical"
        width={500}
        height={40 * agencyChartData.length}
        data={agencyChartData}
        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={120} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8">
          {agencyChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>


      <footer className="footer">
        <p>© 2025 CosmoQuery • Built by Aman Singh 🚀</p>
      </footer>

      <div className={`satellite-details-panel ${selectedSatellite ? "visible" : ""}`}>
        {selectedSatellite && (
          <div className="satellite-details-content">
            <button className="close-btn" onClick={() => setSelectedSatellite(null)}>X</button>
            <h2>{selectedSatellite.name}</h2>
            <p><strong>Launch Date:</strong> {selectedSatellite.launchDate}</p>
            <p><strong>Status:</strong> {selectedSatellite.status}</p>
            <p><strong>Orbit Type:</strong> {selectedSatellite.orbitType}</p>
            <p><strong>Agency:</strong> {selectedSatellite.agency || "Unknown"}</p>
            <p><strong>Country:</strong> {selectedSatellite.country === "USA" ? "🇺🇸 USA" : selectedSatellite.country === "India" ? "🇮🇳 India" : selectedSatellite.country || "Unknown"}</p>
            <p><strong>Purpose:</strong> {selectedSatellite.purpose || "N/A"}</p>
            <p><strong>Mission Duration:</strong> {selectedSatellite.duration || "N/A"}</p>

          </div>
        )}
      </div>

      {showModal && (
        <CompareModal
          satellites={selectedSatellites}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
