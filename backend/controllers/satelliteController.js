const Satellite = require("../models/Satellite");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Utility to guess agency
function guessAgency(objectName) {
  if (objectName.includes("STARLINK")) return "SpaceX";
  if (objectName.includes("COSMOS")) return "Roscosmos";
  if (objectName.includes("NAVSTAR")) return "USAF";
  if (objectName.includes("IRNSS")) return "ISRO";
  if (objectName.includes("GALILEO")) return "ESA";
  if (objectName.includes("TIANGONG")) return "CNSA";
  if (objectName.includes("ISS")) return "NASA";
  return "Unknown";
}

// Orbit type logic
function getOrbitType(sat) {
  const inclination = parseFloat(sat.INCLINATION || 0);
  if (inclination < 20) return "Equatorial";
  if (inclination > 70) return "Polar";
  return "Inclined";
}

// ✅ Main API with Pagination + Filters + Sort
exports.getSatellites = async (req, res) => {
  try {
    const { page = 1, limit = 50, sort = "OBJECT_NAME", order = "asc", orbitType, status, search } = req.query;

    // ✅ Check DB first
    const existingCount = await Satellite.countDocuments({});
    if (existingCount === 0) {
      console.log("Database empty → Fetching from Celestrak...");
      const response = await fetch("https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json");
      const rawData = await response.json();

      // Clean & Map Data
      const cleaned = rawData.map((sat) => {
        const agency = guessAgency(sat.OBJECT_NAME);
        const country =
          agency === "NASA" || agency === "SpaceX" || agency === "USAF"
            ? "USA"
            : agency === "ISRO"
            ? "India"
            : agency === "Roscosmos"
            ? "Russia"
            : agency === "CNSA"
            ? "China"
            : agency === "ESA"
            ? "Europe"
            : "Unknown";

        return {
          NORAD_CAT_ID: sat.NORAD_CAT_ID,
          OBJECT_NAME: sat.OBJECT_NAME,
          EPOCH: sat.EPOCH || "Unknown",
          orbitType: getOrbitType(sat),
          agency,
          country,
          purpose: "N/A",
          status: "Active",
        };
      });

      await Satellite.insertMany(cleaned);
      console.log(`✅ Inserted ${cleaned.length} satellites`);
    }

    // ✅ Build Filters
    const query = {};
    if (orbitType && orbitType !== "All") query.orbitType = orbitType;
    if (status && status !== "All") query.status = status;
    if (search && search.trim() !== "") query.OBJECT_NAME = { $regex: search, $options: "i" };

    // ✅ Pagination & Sorting
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const satellites = await Satellite.find(query)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Satellite.countDocuments(query);

    res.json({
      satellites,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch/store satellites:", error);
    res.status(500).json({ error: "Failed to fetch/store satellites", details: error.message });
  }
};
