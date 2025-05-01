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

router.get('/states/population', (req, res) => {
    const order = req.query.order || 'asc';
    const sortedStates = statesData.sort((a, b) => {
        if (order === 'asc') return a.population - b.population;
        return b.population - a.population;
    });
    res.json(sortedStates);
});

router.get('/states/admitted', (req, res) => {
    const { before, after } = req.query;
    const filteredStates = statesData.filter(state => {
        const year = parseInt(state.admission_date.split('-')[0]);
        if (before) return year < parseInt(before);
        if (after) return year > parseInt(after);
        return true;
    });
    res.json(filteredStates);
});






module.exports = router;
