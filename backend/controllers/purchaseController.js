const Purchase = require('../models/Purchase');
const jwt = require('jsonwebtoken');

// Get user from token
const getUserFromToken = (req) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// Create a new purchase
exports.createPurchase = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { items, totalAmount, purchaseType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items to purchase' });
    }

    const purchase = new Purchase({
      user: userId,
      items,
      totalAmount,
      purchaseType: purchaseType || 'direct',
      status: 'completed'
    });

    await purchase.save();

    res.status(201).json({
      message: 'Purchase recorded successfully',
      purchase
    });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all purchases for a user
exports.getUserPurchases = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const purchases = await Purchase.find({ user: userId })
      .sort({ purchaseDate: -1 });

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all purchases (admin only)
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('user', 'name email')
      .sort({ purchaseDate: -1 });

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching all purchases:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get purchase statistics
exports.getPurchaseStats = async (req, res) => {
  try {
    const totalPurchases = await Purchase.countDocuments();
    const totalRevenue = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      totalPurchases,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
    });
  } catch (error) {
    console.error('Error fetching purchase stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
