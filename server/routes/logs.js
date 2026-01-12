const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// @desc    Get all logs
// @route   GET /api/logs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { level, limit = 100 } = req.query;
        const query = level ? { level } : {};

        const logs = await Log.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Create new log
// @route   POST /api/logs
// @access  Public
router.post('/', async (req, res) => {
    try {
        const log = await Log.create(req.body);
        res.status(201).json(log);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get logs by level
// @route   GET /api/logs/level/:level
// @access  Public
router.get('/level/:level', async (req, res) => {
    try {
        const logs = await Log.find({ level: req.params.level })
            .sort({ timestamp: -1 })
            .limit(50);
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
