const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const normalizedEmail = email && String(email).trim().toLowerCase();

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email: normalizedEmail, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: 'User registered successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email && String(email).trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    } catch (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};
