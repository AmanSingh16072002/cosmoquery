// config.js
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://cosmoquery.onrender.com" // ✅ your Render backend URL
    : "http://localhost:5000"; // for local dev

export default API_BASE_URL;
