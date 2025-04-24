const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

const statesRouter = require('./routes/states');
app.use('/states', statesRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the US States API!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
