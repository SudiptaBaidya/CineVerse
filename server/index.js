const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'https://cine-verse-omega-seven.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cineverse')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
try {
  const userRoutes = require('./routes/users');
  app.use('/api/users', userRoutes);
  console.log('User routes loaded successfully');
} catch (error) {
  console.error('Error loading user routes:', error);
}

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'CineVerse API is running!' });
});

// Debug route to check if routes are loaded
app.get('/api/debug', (req, res) => {
  res.json({ 
    message: 'Debug info',
    routes: app._router.stack.map(r => r.route?.path || 'middleware')
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});