const express = require('express');
const router = express.Router();
const db = require('./config/db');

router.get('/ping', (__, res) => res.send('pong'));
router.use('/auth', require('./routes/authRoutes'));
router.use('/product', require('./routes/productRoutes'));
router.use('/order', require('./routes/orderRoutes'));
router.use('/promo', require('./routes/promoRoutes'));

// Route to return all environment variables and their values
router.get('/system/env', (req, res) => {
  res.json(process.env);
});

// Route to check if the database is working
router.get('/system/db-health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
  }
});

module.exports = router;