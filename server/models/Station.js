const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    sensorId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'online'
    },
    lastPing: {
        type: Date,
        default: Date.now
    }
});

const stationSchema = new mongoose.Schema({
    stationId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    province: {
        type: String,
        default: 'Unknown'
    },
    line: {
        type: String,
        required: true
    },
    sensors: [sensorSchema],
    totalApproaches: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Station', stationSchema);
