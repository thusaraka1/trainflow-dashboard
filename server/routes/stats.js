const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const TrainApproach = require('../models/TrainApproach');

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Get total stations
        const totalStations = await Station.countDocuments();

        // Get total approaches (sum of all station approaches)
        const stationsWithApproaches = await Station.aggregate([
            { $group: { _id: null, total: { $sum: '$totalApproaches' } } }
        ]);
        const totalApproaches = stationsWithApproaches[0]?.total || 0;

        // Get sensors count
        const sensorStats = await Station.aggregate([
            { $unwind: '$sensors' },
            {
                $group: {
                    _id: '$sensors.status',
                    count: { $sum: 1 }
                }
            }
        ]);

        let sensorsOnline = 0;
        let sensorsOffline = 0;
        sensorStats.forEach(stat => {
            if (stat._id === 'online') sensorsOnline = stat.count;
            if (stat._id === 'offline') sensorsOffline = stat.count;
        });

        // Get active trains
        const activeTrains = await TrainApproach.countDocuments({ status: 'approaching' });

        res.json({
            totalStations,
            totalApproaches,
            sensorsOnline,
            sensorsOffline,
            activeTrains
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
