const express = require('express');
const router = express.Router();
const Station = require('../models/Station');

// @desc    Get all stations
// @route   GET /api/stations
// @access  Public
router.get('/', async (req, res) => {
    try {
        const stations = await Station.find().sort({ stationId: 1 });
        res.json(stations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get stations by line
// @route   GET /api/stations/line/:line
// @access  Public
router.get('/line/:line', async (req, res) => {
    try {
        const lineName = req.params.line.replace(/%20/g, ' ');
        const stations = await Station.find({ line: lineName }).sort({ stationId: 1 });
        res.json(stations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get station by ID
// @route   GET /api/stations/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const station = await Station.findOne({ stationId: req.params.id });
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }
        res.json(station);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get unique lines
// @route   GET /api/stations/lines/all
// @access  Public
router.get('/lines/all', async (req, res) => {
    try {
        const lines = await Station.distinct('line');
        res.json(lines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Update station sensor status
// @route   PUT /api/stations/:id/sensor/:sensorId
// @access  Public
router.put('/:id/sensor/:sensorId', async (req, res) => {
    try {
        const { status } = req.body;
        const station = await Station.findOne({ stationId: req.params.id });

        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        const sensor = station.sensors.find(s => s.sensorId === req.params.sensorId);
        if (sensor) {
            sensor.status = status;
            sensor.lastPing = new Date();
            await station.save();
        }

        res.json(station);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
