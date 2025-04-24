const State = require('../models/States');

const getStates = async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStates };
