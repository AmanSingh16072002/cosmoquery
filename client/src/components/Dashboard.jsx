import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Dashboard.css";
import CompareModal from "./CompareModal";
import ColorModeToggle from "./ColorModeToggle";
import OrbitChart from './OrbitChart';
import AgencyBarChart from './AgencyBarChart';
import Footer from "./Footer";
import API_BASE_URL from "../config";
import { io } from "socket.io-client";

// 🛰️ Helper: Orbit Type Detection
function getOrbitType(satellite) {
  const name = satellite.OBJECT_NAME?.toLowerCase() || "";

  if (name.includes("geo")) return "GEO";
  if (name.includes("leo")) return "LEO";
  if (name.includes("meo")) return "MEO";
  if (name.includes("heosat") || name.includes("elliptical")) return "HEO";
  if (name.includes("polar")) return "Polar";

  // Random fallback for demo purposes
  const orbits = ["LEO", "GEO", "MEO", "Polar", "HEO"];
  return orbits[Math.floor(Math.random() * orbits.length)];
}

// 🛰️ Agency guesser
function guessAgency(name) {
  name = name.toUpperCase();

  if (name.includes("ISS") || name.includes("NASA") || name.includes("STARLINK")) return "NASA";
  if (name.includes("IRNSS") || name.includes("RISAT") || name.includes("INSAT") || name.includes("GSAT")) return "ISRO";
  if (name.includes("COSMOS") || name.includes("GLONASS") || name.includes("PROGRESS")) return "Roscosmos";
  if (name.includes("BEIDOU") || name.includes("TIANZHOU") || name.includes("YAOGAN")) return "CNSA";
  if (name.includes("GALILEO")) return "ESA";
  if (name.includes("ONEWEB")) return "OneWeb";
  if (name.includes("NAVSTAR")) return "USAF";
  return "Unknown";
}

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  // ✅ Reset Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setOrbitFilter("All");
    setStatusFilter("All");
    setAgencyFilter("All");
    setSortBy("name-asc");
  };

  const API_URL = `${API_BASE_URL}/api/satellites`;
  
         // ✅ Socket.IO Realtime Updates
  // ✅ Socket.IO Realtime Updates (disabled in production)
useEffect(() => {
  let socket;

  if (process.env.NODE_ENV !== "production") {
    socket = io(API_BASE_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("🔗 Connected to Satellite WebSocket");
    });

    socket.on("satelliteUpdate", (newSat) => {
      console.log("🛰️ New Satellite Update:", newSat);

      const mapped = mapSatelliteData(newSat);

      setSatellites((prev) => {
        const exists = prev.some((s) => s.id === mapped.id);
        return exists
          ? prev.map((s) => (s.id === mapped.id ? mapped : s))
          : [mapped, ...prev];
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from Satellite WebSocket");
    });
  }

  return () => {
    if (socket) socket.disconnect();
  };
}, []);


  // ✅ Fetch Satellites
  useEffect(() => {
    const fetchSatellites = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch satellites");
        const data = await response.json();

        const mappedSatellites = data.map((sat) => {
          const orbitType = getOrbitType(sat);
          const agency = guessAgency(sat.OBJECT_NAME);
          const country = agency === "NASA" ? "USA" :
                          agency === "ISRO" ? "India" :
                          agency === "Roscosmos" ? "Russia" :
                          agency === "CNSA" ? "China" :
                          agency === "ESA" ? "Europe" :
                          agency === "OneWeb" ? "UK" :
                          agency === "USAF" ? "USA" : "Unknown";

          return {
            id: sat.NORAD_CAT_ID,
            name: sat.OBJECT_NAME,
            launchDate: sat.EPOCH || "Unknown",
            status: "Active",
            orbitType,
            agency,
            country,
            purpose: "N/A",
            duration: "N/A"
          };
        });

 
        setSatellites(mappedSatellites);
      } catch (error) {
        console.error("Failed to fetch satellites:", error);
        setError("Unable to load satellites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSatellites();
  }, [API_URL]);

  // ✅ Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, orbitFilter, statusFilter, agencyFilter]);

  // ✅ Filter satellites
  const filteredSatellites = useMemo(() => {
    return satellites.filter((sat) => {
      const matchesSearch = sat.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOrbit = orbitFilter === "All" || sat.orbitType === orbitFilter;
      const matchesStatus = statusFilter === "All" || sat.status === statusFilter;
      const matchesAgency = agencyFilter === "All" || sat.agency === agencyFilter;
      return matchesSearch && matchesOrbit && matchesStatus && matchesAgency;
    });
  }, [satellites, searchTerm, orbitFilter, statusFilter, agencyFilter]);

  // ✅ Unique agencies
  const uniqueAgencies = useMemo(() => {
    return ["All", ...new Set(satellites.map((sat) => sat.agency).filter(Boolean))];
  }, [satellites]);

  // ✅ Sort satellites
  const sortedSatellites = useMemo(() => {
    return [...filteredSatellites].sort((a, b) => {
      switch (sortBy) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "launchDate-asc": return new Date(a.launchDate) - new Date(b.launchDate);
        case "launchDate-desc": return new Date(b.launchDate) - new Date(a.launchDate);
        default: return 0;
      }
    });
  }, [filteredSatellites, sortBy]);

  // ✅ Orbit Chart Data
  const orbitChartData = useMemo(() => {
    return filteredSatellites.reduce((acc, sat) => {
      const orbit = sat.orbitType || "Unknown";
      const existing = acc.find((item) => item.name === orbit);
      if (existing) existing.value += 1;
      else acc.push({ name: orbit, value: 1 });
      return acc;
    }, []);
  }, [filteredSatellites]);

  // ✅ Agency Chart Data
  const agencyCounts = filteredSatellites.reduce((acc, sat) => {
    const agency = sat.agency || "Unknown";
    acc[agency] = (acc[agency] || 0) + 1;
    return acc;
  }, {});
  const agencyChartData = Object.entries(agencyCounts).map(([agency, count]) => ({ name: agency, count }));

  // ✅ Pagination
  const totalPages = Math.ceil(sortedSatellites.length / itemsPerPage);
  const paginatedSatellites = sortedSatellites.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ✅ Satellite selection for compare
  const toggleSelectSatellite = (satellite) => {
    const exists = selectedSatellites.find((s) => s.id === satellite.id);
    if (exists) {
      setSelectedSatellites(selectedSatellites.filter((s) => s.id !== satellite.id));
    } else if (selectedSatellites.length < 2) {
      setSelectedSatellites([...selectedSatellites, satellite]);
    }
  };

  return (
    <div className="dashboard-container">
      {error ? (
        <div className="error-container">
          <h2>Something went wrong 🚨</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* ✅ Header */}
          <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>🛰️ Satellite Dashboard</h1>
            <ColorModeToggle />
          </div>

          <p>Total Satellites: {satellites.length}</p>

          {/* ✅ Filters */}
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

          {/* ✅ Satellite List */}
          <div className="satellite-list">
            <AnimatePresence>
              {paginatedSatellites.length > 0 ? (
                paginatedSatellites.map((sat) => (
                  <motion.div
                    className={`satellite-card ${selectedSatellites.some(s => s.id === sat.id) ? "selected" : ""}`}
                    key={sat.id}
                    onClick={() => setSelectedSatellite(sat)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <h3>{sat.name}</h3>
                    <p><strong>Launch Date:</strong> {sat.launchDate}</p>
                    <p><strong>Status:</strong> {sat.status}</p>
                    <p><strong>Orbit Type:</strong> {sat.orbitType}</p>
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
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3>No satellites match the selected filters 🚫🛰️</h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ✅ Pagination */}
          <div className="pagination">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>

          {/* ✅ Charts */}
          <div className="chart-section">
            <h3>Satellites by Orbit Type</h3>
            <OrbitChart key={JSON.stringify(orbitChartData)} data={orbitChartData} />
          </div>

          <AgencyBarChart data={agencyChartData} />

          {/* ✅ Details Panel */}
          <div className={`satellite-details-panel ${selectedSatellite ? "visible" : ""}`}>
            {selectedSatellite && (
              <div className="satellite-details-content">
                <button className="close-btn" onClick={() => setSelectedSatellite(null)}>X</button>
                <h2>{selectedSatellite.name}</h2>
                <p><strong>Launch Date:</strong> {selectedSatellite.launchDate}</p>
                <p><strong>Status:</strong> {selectedSatellite.status}</p>
                <p><strong>Orbit Type:</strong> {selectedSatellite.orbitType}</p>
                <p><strong>Agency:</strong> {selectedSatellite.agency || "Unknown"}</p>
                <p><strong>Country:</strong> {selectedSatellite.country}</p>
                <p><strong>Purpose:</strong> {selectedSatellite.purpose || "N/A"}</p>
                <p><strong>Mission Duration:</strong> {selectedSatellite.duration || "N/A"}</p>
              </div>
            )}
          </div>

          {/* ✅ Compare Modal */}
          {showModal && (
            <CompareModal
              satellites={selectedSatellites}
              onClose={() => setShowModal(false)}
            />
          )}

          <Footer />
        </>
      )}
    </div>
  );
};

export default Dashboard;
