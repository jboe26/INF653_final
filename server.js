require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db'); // For MongoDB connection

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to handle JSON requests
app.use(express.json());

// Routes
app.use('/states', require('./routes/states')); // Your states routes

// Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404);
  if (req.accepts('html')) {
      res.send('<h1>404 Not Found</h1>');
  } else if (req.accepts('json')) {
      res.json({ error: '404 Not Found' });
  } else {
      res.type('txt').send('404 Not Found');
  }
});



// Start the server after MongoDB connection is ready
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
