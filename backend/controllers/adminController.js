const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Admin login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        address: admin.address,
        profilePhoto: admin.profilePhoto,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update admin profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, email, phone, address, profilePhoto, currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }

      const isPasswordValid = await admin.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
      }

      admin.password = newPassword;
    }

    // Update other fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (phone !== undefined) admin.phone = phone;
    if (address !== undefined) admin.address = address;
    if (profilePhoto !== undefined) admin.profilePhoto = profilePhoto;

    await admin.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        address: admin.address,
        profilePhoto: admin.profilePhoto,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// Create initial admin (for setup)
exports.createInitialAdmin = async (req, res) => {
  try {
    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const admin = new Admin({
      name,
      email,
      password
    });

    await admin.save();

    const token = generateToken(admin._id);

    res.status(201).json({
      message: 'Admin created successfully',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        address: admin.address,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error while creating admin' });
  }
};
