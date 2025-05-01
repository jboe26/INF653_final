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
router.post('/states/:state/funfacts', addFunFact);
router.patch('/states/:state/funfacts', updateFunFact);
router.delete('/states/:state/funfacts', deleteFunFact);

module.exports = router;
