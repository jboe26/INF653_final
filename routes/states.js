const express = require('express');
const { getStates } = require('../controllers/statesController');
const router = express.Router();

router.get('/', getStates);

module.exports = router;
