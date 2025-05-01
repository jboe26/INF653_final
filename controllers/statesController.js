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

// Add fun fact
const addFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { funfacts } = req.body;

    if (!Array.isArray(funfacts) || funfacts.length === 0) {
        return res.status(400).json({ message: 'Fun facts value must be a non-empty array.' });
    }

    try {
        const state = await State.findOne({ stateCode });

        if (!state) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        state.funfacts = [...state.funfacts, ...funfacts];
        await state.save();

        res.json({ message: 'Fun facts added successfully!', funfacts: state.funfacts });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Get random fun fact
const getRandomFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();

    try {
        const state = await State.findOne({ stateCode });
        
        // Get full state name from statesData
        const stateData = statesData.find(s => s.code === stateCode);
        const stateName = stateData ? stateData.state : stateCode;

        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
        }

        const randomFact = state.funfacts[Math.floor(Math.random() * state.funfacts.length)];
        res.json({ funfact: randomFact });
    } catch (err) {
        console.error('Server Error:', err); 
        res.status(500).json({ error: 'Server error' });
    }
};

// Update fun fact
const updateFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { index, funfact } = req.body;

    if (index === undefined || !funfact) {
        return res.status(400).json({ message: 'Provide both the index and the new fun fact.' });
    }

    try {
        const state = await State.findOne({ stateCode });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateCode}` });
        }

        if (index - 1 < 0 || index - 1 >= state.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${stateCode}` });
        }

        state.funfacts[index - 1] = funfact;
        await state.save();

        res.json({ message: 'Fun fact updated successfully.', funfacts: state.funfacts });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete fun fact
const deleteFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { index } = req.body;

    if (index === undefined) {
        return res.status(400).json({ message: 'Provide the index of the fun fact to delete.' });
    }

    try {
        const state = await State.findOne({ stateCode });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateCode}` });
        }

        if (index - 1 < 0 || index - 1 >= state.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${stateCode}` });
        }

        state.funfacts.splice(index - 1, 1);
        await state.save();

        res.json({ message: 'Fun fact deleted successfully.', funfacts: state.funfacts });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Function to rank states by population
const getPopulationRank = (req, res) => {
    const order = req.query.order || 'asc'; 
    const sortedStates = statesData.sort((a, b) => {
        if (order === 'asc') return a.population - b.population;
        return b.population - a.population;
    });
    res.json(sortedStates);
};

// Function to filter states by admission date
const getStatesByAdmissionDate = (req, res) => {
    const { before, after } = req.query;
    const filteredStates = statesData.filter(state => {
        const year = parseInt(state.admission_date.split('-')[0]);
        if (before) return year < parseInt(before);
        if (after) return year > parseInt(after);
        return true;
    });
    res.json(filteredStates);
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
    getAdmissionDate, 
    getPopulationRank,
    getStatesByAdmissionDate
};
