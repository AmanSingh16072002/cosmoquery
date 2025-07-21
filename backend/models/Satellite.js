const mongoose = require("mongoose");

const SatelliteSchema = new mongoose.Schema({
  NORAD_CAT_ID: {
    type: Number,
    required: true,
    unique: true,
  },
  OBJECT_NAME: {
    type: String,
    required: true,
  },
  EPOCH: {
    type: String,
  },
  agency: {
    type: String,
    default: "Unknown",
  },
  orbitType: {
    type: String,
    default: "Unknown",
  },
  country: {
    type: String,
    default: "Unknown",
  },
  purpose: {
    type: String,
    default: "N/A",
  },
  status: {
    type: String,
    default: "Active",
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Satellite", SatelliteSchema);
