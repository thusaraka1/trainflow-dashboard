const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['info', 'warning', 'error'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Log', logSchema);
