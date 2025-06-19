const express = require('express');
const router = express.Router();
const { addPromoCode, getAllPromoCodes, updatePromoCode, deletePromoCode } = require('../controllers/promoController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all promo codes
router.get('/all', getAllPromoCodes);

// Add new promo code
router.post('/', addPromoCode);

// Update promo code
router.put('/:id', updatePromoCode);

// Delete promo code
router.delete('/:id', deletePromoCode);

module.exports = router;