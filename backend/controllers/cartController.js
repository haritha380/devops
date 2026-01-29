const CartItem = require('../models/CartItem');
const Purchase = require('../models/Purchase');
const jwt = require('jsonwebtoken');

// Get user from token
const getUserFromToken = (req) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    return decoded.id;
  } catch (err) {
    return null;
  }
};

// Get user's cart items
exports.getCartItems = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const cartItems = await CartItem.find({ user: userId }).sort({ createdAt: -1 });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { itemType, itemId, name, price, details, image } = req.body;
    
    console.log('Add to cart request body:', req.body);
    console.log('Image value:', image, 'Type:', typeof image);

    if (!itemType || !itemId || !name || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({ user: userId, itemId, itemType });
    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      console.log('Updated existing cart item:', existingItem);
      return res.json(existingItem);
    }

    // Create new cart item
    const cartItem = new CartItem({
      user: userId,
      itemType,
      itemId,
      name,
      price,
      details,
      image,
      quantity: 1,
    });

    const savedItem = await cartItem.save();
    console.log('Created new cart item:', savedItem);
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const cartItem = await CartItem.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Verify the item belongs to the user
    if (cartItem.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
exports.updateQuantity = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const cartItem = await CartItem.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (cartItem.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Purchase (clear cart)
exports.purchaseCart = async (req, res) => {
  console.log('=== PURCHASE CART ENDPOINT HIT ===');
  try {
    const userId = getUserFromToken(req);
    console.log('User ID:', userId);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const cartItems = await CartItem.find({ user: userId });
    console.log('Cart items found:', cartItems.length);
    
    if (cartItems.length === 0) {
      console.log('Cart is empty, returning error');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('Total amount:', total);

    // Create purchase record
    console.log('Creating Purchase record...');
    const purchase = new Purchase({
      user: userId,
      items: cartItems.map(item => ({
        itemType: item.itemType,
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        details: item.details,
        image: item.image
      })),
      totalAmount: total,
      purchaseType: 'cart',
      status: 'completed'
    });

    await purchase.save();
    console.log('Purchase saved to database:', purchase._id);

    // Clear the cart
    await CartItem.deleteMany({ user: userId });

    res.json({ 
      message: 'Purchase successful!', 
      itemCount: cartItems.length,
      total: total.toFixed(2),
      purchaseId: purchase._id
    });
  } catch (error) {
    console.error('Error purchasing cart:', error);
    res.status(500).json({ message: error.message });
  }
};
