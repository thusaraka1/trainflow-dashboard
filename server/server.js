const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for testing
    credentials: true
}));
app.use(express.json());

// Simulation routes (works without database)
console.log('Loading simulation routes...');
app.use('/api/simulation', require('./routes/simulation'));
console.log('Simulation routes loaded');

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'TrainFlow API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`====================================`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Simulation API: http://localhost:${PORT}/api/simulation`);
    console.log(`====================================`);
});
