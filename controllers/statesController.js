const statesData = require('../data/statesData.json');
const State = require('../models/States');

const getAllStates = async (req, res) => {
    try {
        const { contig } = req.query;

        // Combine states data with MongoDB funfacts
        const states = await Promise.all(statesData.map(async (state) => {
            const dbState = await State.findOne({ stateCode: state.code });
            return { ...state, funfacts: dbState ? dbState.funfacts : undefined };
        }));

        // Filter based on `contig` query parameter
        let filteredStates;
        if (contig === 'true') {
            filteredStates = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
        } else if (contig === 'false') {
            filteredStates = states.filter(state => state.code === 'AK' || state.code === 'HI');
        } else {
            filteredStates = states; // Return all states if `contig` is not specified
        }

        res.json(filteredStates);
    } catch (err) {
        console.error('Error fetching states:', err);
        res.status(500).json({ error: 'Server error occurred while fetching states.' });
    }
};

const getStateByCode = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);

    if (!state) {
        return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
    }

    try {
        const dbState = await State.findOne({ stateCode });

        console.log('DB State:', dbState);
        console.log('DB Funfacts:', dbState && dbState.funfacts);
        console.log('State Code:', stateCode, '| Final Property Count:',
            Object.keys({
                ...state,
                ...(dbState && dbState.funfacts && dbState.funfacts.length > 0 && { funfacts: dbState.funfacts })
            }).length
        );

        res.json({
            ...state,
            ...(dbState && dbState.funfacts && dbState.funfacts.length > 0 && { funfacts: dbState.funfacts })
        });

    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const addFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { funfacts } = req.body;

    if (!Array.isArray(funfacts) || funfacts.length === 0) {
        return res.status(400).json({ error: 'Fun facts value must be a non-empty array.' });
    }

    try {
        const state = await State.findOne({ stateCode });

        if (!state) {
            return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
        }

        state.funfacts = [...state.funfacts, ...funfacts];
        await state.save();

        res.json({ message: 'Fun facts added successfully!', funfacts: state.funfacts });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

const getRandomFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();

    try {
        const state = await State.findOne({ stateCode });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ error: 'No fun facts found for this state.' });
        }

        console.log('State Found:', state);

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

        state.funfacts[index] = funfact;
        await state.save();
        res.status(200).json(state);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getNickname = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);

    if (!state) {
        return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: state.name, nickname: state.nickname });
};

const getCapital = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);

    // Validate state code
    if (!state) {
        return res.status(404).json({ error: `State with code "${stateCode}" not found.` });
    }

    res.json({ state: state.name, capital: state.capital });
};

const getPopulation = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);

    if (!state) {
        return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: state.name, population: state.population.toLocaleString() });
};

const getAdmissionDate = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);

    if (!state) {
        return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: state.name, admitted: state.admission_date });
};

const deleteFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { index } = req.body;

    if (index === undefined) {
        return res.status(400).json({ error: 'Provide the index of the fun fact to delete.' });
    }

    try {
        const state = await State.findOne({ stateCode });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ error: 'No fun facts found for this state.' });
        }

        if (index - 1 < 0 || index - 1 >= state.funfacts.length) {
            return res.status(404).json({ error: 'Fun fact not found at the given index.' });
        }

        state.funfacts.splice(index - 1, 1);
        await state.save();

        res.status(200).json(state);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};




module.exports = {
    getAllStates,
    getStateByCode,
    addFunFact,
    getRandomFunFact,
    updateFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmissionDate,
    deleteFunFact
};

