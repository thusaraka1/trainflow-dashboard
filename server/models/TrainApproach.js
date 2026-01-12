const mongoose = require('mongoose');

const trainApproachSchema = new mongoose.Schema({
    trainId: {
        type: String,
        required: true
    },
    stationId: {
        type: String,
        required: true
    },
    stationName: {
        type: String,
        required: true
    },
    sensorId: {
        type: String,
        required: true
    },
    speed: {
        type: Number,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['approaching', 'passed', 'stopped'],
        default: 'approaching'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TrainApproach', trainApproachSchema);
