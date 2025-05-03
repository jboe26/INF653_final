const statesData = require('../data/statesData.json');
const State = require('../models/States');

// Get all states
const getAllStates = async (req, res) => {
    try {
        const { contig } = req.query;

        const states = await Promise.all(statesData.map(async (state) => {
            const dbState = await State.findOne({ stateCode: state.code });
            return { ...state, funfacts: dbState ? dbState.funfacts : undefined };
        }));

        let filteredStates;
        if (contig === 'true') {
            filteredStates = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
        } else if (contig === 'false') {
            filteredStates = states.filter(state => state.code === 'AK' || state.code === 'HI');
        } else {
            filteredStates = states;
        }

        res.json(filteredStates);
    } catch (err) {
        console.error('Error fetching states:', err);
        res.status(500).json({ message: 'Server error occurred while fetching states.' });
    }
};

// Get state by code
const getStateByCode = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);

    if (!state) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    try {
        const dbState = await State.findOne({ stateCode });

        res.json({
            ...state,
            funfacts: dbState && dbState.funfacts && dbState.funfacts.length > 0
                ? dbState.funfacts
                : undefined,
        });
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get capital
const getCapital = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);

    if (!state) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: state.state, capital: state.capital_city });
};

// Get nickname
const getNickname = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);

    if (!state) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: state.state, nickname: state.nickname });
};

// Get population
const getPopulation = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);

    if (!state) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: state.state, population: state.population.toLocaleString() });
};

// Get admission date
const getAdmissionDate = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);

    if (!state) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: state.state, admitted: state.admission_date });
};

// Get random fun fact
const getRandomFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();

    // Validate state abbreviation using statesData.json
    const stateData = statesData.find(s => s.code === stateCode);
    if (!stateData) {
        return res.status(404).json({ message: "Invalid state abbreviation parameter" });
    }

    try {
        const state = await State.findOne({ stateCode });

        const stateName = stateData.state; // Get full state name

        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
        }

        const randomFact = state.funfacts[Math.floor(Math.random() * state.funfacts.length)];
        res.json({ funfact: randomFact });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Add fun fact
const addFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { funfacts } = req.body;

    // Ensure funfacts is present
    if (!funfacts) {
        return res.status(400).json({ message: "State fun facts value required" });
    }

    // Ensure funfacts is an array
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ message: "State fun facts value must be an array" });
    }

    try {
        const state = await State.findOne({ stateCode });

        if (!state) {
            return res.status(404).json({ message: "Invalid state abbreviation parameter" });
        }

        // Ensure funfacts persist by appending new values
        state.funfacts = [...(state.funfacts || []), ...funfacts];
        await state.save();

        // Return full state object with 4 properties
        res.json({
            state: state.state, // Full state name
            stateCode: state.stateCode, // Abbreviation
            funfacts: state.funfacts,
            message: "Fun facts added successfully!" // Ensure response has 4 properties
        });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Update fun fact
const updateFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const index = req.body.index;
    const newFunFact = req.body.funfact;

    try {
        const state = await State.findOne({ stateCode });

        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${state.state}` }); // Use full state name
        }

        if (index === undefined || index === null) {
            return res.status(400).json({ message: "State fun fact index value required" });
        }

        // Convert index from 1-based to 0-based
        const zeroBasedIndex = index - 1;

        if (zeroBasedIndex < 0 || zeroBasedIndex >= state.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${state.state}` });
        }

        if (!newFunFact) {
            return res.status(400).json({ message: "State fun fact value required" });
        }

        state.funfacts[zeroBasedIndex] = newFunFact;
        await state.save();

        res.json({
            state: state.state,
            stateCode: state.stateCode,
            funfacts: state.funfacts,
            message: "Fun fact updated successfully!" 
        });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete fun fact
const deleteFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const index = req.body.index;

    try {
        const state = await State.findOne({ stateCode });

        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${state.state}` }); // Use full state name
        }

        if (index === undefined || index === null) {
            return res.status(400).json({ message: "State fun fact index value required" });
        }

        const zeroBasedIndex = index - 1;

        if (zeroBasedIndex < 0 || zeroBasedIndex >= state.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${state.state}` });
        }

        state.funfacts.splice(zeroBasedIndex, 1);
        await state.save();

        res.json({
            state: state.state,
            stateCode: state.stateCode,
            funfacts: state.funfacts,
            message: "Fun fact deleted successfully!" // Ensure response includes 4 properties
        });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getAllStates,
    getStateByCode,
    addFunFact,
    getRandomFunFact,
    updateFunFact,
    deleteFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmissionDate
};
