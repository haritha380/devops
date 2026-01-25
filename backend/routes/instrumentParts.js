const express = require('express');
const instrumentPartController = require('../controllers/instrumentPartController');

const router = express.Router();

router.get('/', instrumentPartController.getAllParts);
router.get('/:id', instrumentPartController.getPart);
router.post('/', instrumentPartController.createPart);
router.put('/:id', instrumentPartController.updatePart);
router.delete('/:id', instrumentPartController.deletePart);

module.exports = router;
