const express = require('express');
const router = express.Router();
const {
  createPurchase,
  getUserPurchases,
  getAllPurchases,
  getPurchaseStats
} = require('../controllers/purchaseController');

// User routes
router.post('/', createPurchase);
router.get('/my-purchases', getUserPurchases);

// Admin routes
router.get('/all', getAllPurchases);
router.get('/stats', getPurchaseStats);

module.exports = router;
