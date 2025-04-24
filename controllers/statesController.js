const fs = require('fs');
const State = require('../models/States');

const getStates = async (req, res) => {
  try {
    // Read statesData.json
    const statesData = JSON.parse(fs.readFileSync('./models/statesData.json', 'utf8'));

    // Retrieve fun facts from MongoDB
    const mongoStates = await State.find();

    // Merge MongoDB fun facts with statesData.json
    const mergedStates = statesData.map(state => {
      const mongoState = mongoStates.find(s => s.stateCode === state.code);
      return mongoState
        ? { ...state, funfacts: mongoState.funfacts }
        : state;
    });

    res.json(mergedStates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStates };
