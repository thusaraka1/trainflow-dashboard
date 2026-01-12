const express = require('express');
const router = express.Router();
const TrainApproach = require('../models/TrainApproach');

// @desc    Get all train approaches
// @route   GET /api/trains/approaches
// @access  Public
router.get('/approaches', async (req, res) => {
    try {
        const approaches = await TrainApproach.find()
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(approaches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get approaches for a station
// @route   GET /api/trains/approaches/station/:stationId
// @access  Public
router.get('/approaches/station/:stationId', async (req, res) => {
    try {
        const approaches = await TrainApproach.find({ stationId: req.params.stationId })
            .sort({ timestamp: -1 });
        res.json(approaches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Create new train approach
// @route   POST /api/trains/approaches
// @access  Public
router.post('/approaches', async (req, res) => {
    try {
        const approach = await TrainApproach.create(req.body);
        res.status(201).json(approach);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Update train approach status
// @route   PUT /api/trains/approaches/:id
// @access  Public
router.put('/approaches/:id', async (req, res) => {
    try {
        const approach = await TrainApproach.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(approach);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get active trains count
// @route   GET /api/trains/active
// @access  Public
router.get('/active', async (req, res) => {
    try {
        const count = await TrainApproach.countDocuments({ status: 'approaching' });
        res.json({ activeTrains: count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
