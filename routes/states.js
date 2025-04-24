const express = require('express');
const { getStates } = require('../controllers/statesController');
const router = express.Router();

router.get('/', getStates);
router.get('/:state', getState);

module.exports = router;
