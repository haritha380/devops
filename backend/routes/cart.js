const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/', cartController.getCartItems);
router.post('/', cartController.addToCart);
router.delete('/:id', cartController.removeFromCart);
router.put('/:id', cartController.updateQuantity);
router.post('/purchase', cartController.purchaseCart);

module.exports = router;
