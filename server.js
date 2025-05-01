// Import dependencies
const express = require('express');
const cors = require('cors'); // Import CORS middleware
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const statesRoutes = require('./routes/statesRoutes');

dotenv.config(); // Load environment variables

const app = express(); // Initialize Express app

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request body

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/states', statesRoutes);

// Root Endpoint to Serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

// Catch-All for 404 Errors
app.use((req, res) => {
    res.status(404); // Set status code to 404
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', 'views', '404.html')); // Serve an HTML page
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' }); // Serve JSON response
    } else {
        res.type('txt').send('404 Not Found'); // Serve plain text as fallback
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
