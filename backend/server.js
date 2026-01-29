const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Middleware
app.use(cors());
app.use(express.json());

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

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
	const buildPath = path.join(__dirname, '..', 'frontend', 'build');
	app.use(express.static(buildPath));
	app.get('*', (req, res) => {
		res.sendFile(path.join(buildPath, 'index.html'));
	});
}

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

