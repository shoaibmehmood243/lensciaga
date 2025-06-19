const express = require('express');
const router = express.Router();

router.get('/ping', (__, res) => res.send('pong'));
router.use('/auth', require('./routes/authRoutes'));
router.use('/product', require('./routes/productRoutes'));
router.use('/order', require('./routes/orderRoutes'));
router.use('/promo', require('./routes/promoRoutes'));

module.exports = router;