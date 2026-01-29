const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, updateAdminProfile, createInitialAdmin } = require('../controllers/adminController');
const { protect } = require('../controllers/authController');

// Admin authentication
router.post('/login', loginAdmin);
router.post('/create-initial', createInitialAdmin);

// Protected admin routes
router.get('/profile', protect, getAdminProfile);
router.put('/profile', protect, updateAdminProfile);

module.exports = router;
