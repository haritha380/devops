const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const instrumentRoutes = require('./routes/instruments');
const instrumentPartRoutes = require('./routes/instrumentParts');
const cartRoutes = require('./routes/cart');
const statsRoutes = require('./routes/stats');
const adminRoutes = require('./routes/admin');
const purchaseRoutes = require('./routes/purchases');

const app = express();
const PORT = process.env.PORT || 5000;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only (jpeg, jpg, png, gif)!');
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/api/hello', (req, res) => {
	res.json({ message: 'Hello from Express backend!' });
});

app.get('/api/data', (req, res) => {
	res.json({
		data: [
			{ id: 1, name: 'Item 1' },
			{ id: 2, name: 'Item 2' },
			{ id: 3, name: 'Item 3' }
		]
	});
});

// Auth routes
app.use('/api/auth', authRoutes);

// File upload route
app.post('/api/upload', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file: ' + error.message });
  }
});

// Create admin user route (for initial setup)
app.post('/api/create-admin', async (req, res) => {
	try {
		const User = require('./models/User');
		const existingAdmin = await User.findOne({ email: 'bandaraindika@gmail.com' });
		if (existingAdmin) {
			return res.json({ message: 'Admin user already exists' });
		}
		const admin = new User({
			name: 'Admin User',
			email: 'bandaraindika@gmail.com',
			password: 'Haritha@2001',
		});
		await admin.save();
		res.json({ message: 'Admin user created successfully!' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Instrument routes
app.use('/api/instruments', instrumentRoutes);
app.use('/api/instrument-parts', instrumentPartRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/purchases', purchaseRoutes);


// Start server after connecting to DB
const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error('Failed to start server:', err.message);
		process.exit(1);
	}
};

startServer();

