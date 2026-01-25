const express = require('express');
const instrumentController = require('../controllers/instrumentController');

const router = express.Router();

router.get('/', instrumentController.getAllInstruments);
router.get('/:id', instrumentController.getInstrument);
router.post('/', instrumentController.createInstrument);
router.put('/:id', instrumentController.updateInstrument);
router.delete('/:id', instrumentController.deleteInstrument);

module.exports = router;
