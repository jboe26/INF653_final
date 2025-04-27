const statesData = require('../data/statesData.json'); 
const State = require('../models/States'); // MongoDB model

// Get all states with fun facts
const getAllStates = async (req, res) => {
    try {
        const states = await Promise.all(statesData.map(async (state) => {
            const dbState = await State.findOne({ stateCode: state.code });
            return { ...state, funfacts: dbState ? dbState.funfacts : [] };
        }));
        res.json(states);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get specific state information
const getStateByCode = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);

    if (!state) {
        return res.status(404).json({ error: 'State not found' });
    }

    try {
        const dbState = await State.findOne({ stateCode });
        res.json({ ...state, funfacts: dbState ? dbState.funfacts : [] });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Fun Fact for States
const addFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { funfacts } = req.body;

    if (!funfacts || !Array.isArray(funfacts)) {
        return res.status(400).json({ error: 'Invalid data format. Provide an array of fun facts.'})
    }
    try {
        const state = await State.findOneAndUpdate(
            { stateCode },
            { $push: { funfacts: { $each: funfacts } } },
            { new: true, upsert: true }
        );
        res.status(201).json(state);
    } catch (err) {
        res.status(500).json({ error: 'Service error' });
    }
};

const getRandomFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();

    try {
        const state = await State.findOne({ stateCode });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ error: 'No fun facts found for this state.' });
        }

        const randomFact = state.funfacts[Math.floor(Math.random() * state.funfacts.length)];
        res.json({ funfact: randomFact });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { index, funfact } = req.body;

    if (index === undefined || !funfact) {
        return res.status(400).json({ error: 'Provide both the index and the new fun fact.' });
    }

    try {
        const state = await State.findOne({ stateCode });
        if (!state || !state.funfacts || index >= state.funfacts.length) {
            return res.status(404).json({ error: 'Fun fact not found at the given index.' });
        }

        state.funfacts[index] = funfact; // Update the fun fact
        await state.save();
        res.status(200).json(state);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllStates, getStateByCode, addFunFact, getRandomFunFact, updateFunFact };

