const express = require('express');
const router = express.Router();
const { 
    getAllStates, 
    getStateByCode, 
    getRandomFunFact, 
    getCapital, 
    getNickname, 
    getPopulation, 
    getAdmissionDate,
    addFunFact, updateFunFact, deleteFunFact
} = require('../controllers/statesController');

router.get('/', getAllStates);
router.get('/:state', getStateByCode);
router.get('/:state/funfact', getRandomFunFact);
router.get('/:state/capital', getCapital);
router.get('/:state/nickname', getNickname);
router.get('/:state/population', getPopulation);
router.get('/:state/admission', getAdmissionDate);
router.post('/:state/funfact', addFunFact);
router.patch('/:state/funfact', updateFunFact);
router.delete('/:state/funfact', deleteFunFact);

module.exports = router;
