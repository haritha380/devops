const Instrument = require('../models/Instrument');
const InstrumentPart = require('../models/InstrumentPart');
const User = require('../models/User');
const CartItem = require('../models/CartItem');

exports.getAdminStats = async (req, res) => {
  try {
    // Get counts from database
    const totalInstruments = await Instrument.countDocuments();
    const totalParts = await InstrumentPart.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCartItems = await CartItem.countDocuments();
    
    // Get unique users with items in cart
    const usersWithCart = await CartItem.distinct('user');
    
    res.json({
      totalInstruments,
      totalParts,
      totalUsers,
      totalCartItems,
      activeUsers: usersWithCart.length
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: error.message });
  }
};
