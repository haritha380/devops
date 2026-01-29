const mongoose = require('mongoose');
const Admin = require('./models/Admin');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/music-instruments';

async function createInitialAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log('Admin already exists. Exiting...');
      process.exit(0);
    }

    // Create initial admin
    const admin = new Admin({
      name: 'Admin User',
      email: 'bandaraindika@gmail.com',
      password: 'Haritha@2001',
      phone: '+94 77 123 4567',
      address: 'Colombo, Sri Lanka'
    });

    await admin.save();
    console.log('Initial admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: Haritha@2001');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating initial admin:', error);
    process.exit(1);
  }
}

createInitialAdmin();
