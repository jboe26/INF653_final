const express = require('express');
const router = express.Router();
const { getAllStates, getStateByCode, addFunFact, getRandomFunFact, updateFunFact } = require('../controllers/statesController');

// Route to get all states
router.get('/', getAllStates);

// Route to get specific state information
router.get('/:state', getStateByCode);

// Route to add fun facts for a specific state
router.post('/:state/funfact', addFunFact);

// Get random fun fact for a specific state
router.get('/:state/funfact', getRandomFunFact);

// Update a existing fun fact
router.patch('/:state/funfact', updateFunFact);


module.exports = router;
