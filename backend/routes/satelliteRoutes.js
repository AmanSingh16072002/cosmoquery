const express = require('express');
const router = express.Router();
const Satellite = require('../models/Satellite');
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const satellites = await Satellite.find({});
    res.json(satellites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load satellites from DB' });
  }
});

// Seed route to fetch from Celestrak and store in DB (call once)
router.get('/seed', async (req, res) => {
  try {
    const { data } = await axios.get('https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json');
    await Satellite.deleteMany(); // optional: wipe old data
    await Satellite.insertMany(data);
     console.log('✅ Successfully seeded', data.length, 'satellites');
    res.json({ message: 'Database seeded with live satellite data!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

module.exports = router;
