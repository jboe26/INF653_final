// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');

// Initialize dotenv (for environment variables)
dotenv.config();

// Create an Express application
const app = express();

// Middleware for parsing JSON request bodies
app.use(express.json());

// Define the port (from .env or default to 5000)
const PORT = process.env.PORT || 5000;

// Add a test route
app.get('/', (req, res) => {
  res.send('Welcome to the US States API!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
