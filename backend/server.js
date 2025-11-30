require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware (must come BEFORE routes)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route (before MongoDB connection)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cans & Teens backend is running' });
});

// MongoDB Connection (with better error handling)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cansteens';
console.log('🔄 Attempting to connect to MongoDB:', MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.warn('⚠️  Backend will continue to run, but database operations may fail');
  });

// Import routes (AFTER middleware setup)
let menuRoutes, orderRoutes, authRoutes, adminRoutes;
try {
  menuRoutes = require('./routes/menu');
  orderRoutes = require('./routes/orders');
  authRoutes = require('./routes/auth');
  adminRoutes = require('./routes/admin');
  console.log('✅ All routes loaded successfully');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
  process.exit(1);
}

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
});
