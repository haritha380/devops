const express = require('express');
const statsController = require('../controllers/statsController');

const router = express.Router();

router.get('/admin', statsController.getAdminStats);

module.exports = router;
