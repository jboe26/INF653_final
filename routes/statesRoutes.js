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
router.get('/:states', getStateByCode);
router.get('/:states/funfact', getRandomFunFact);
router.get('/:states/capital', getCapital);
router.get('/:states/nickname', getNickname);
router.get('/:states/population', getPopulation);
router.get('/:states/admission', getAdmissionDate);
router.post('/states/:state/funfacts', addFunFact);
router.patch('/states/:state/funfacts', updateFunFact);
router.delete('/states/:state/funfacts', deleteFunFact);

module.exports = router;
