const express = require('express');
const router = express.Router();
const { addPromoCode, getAllPromoCodes, updatePromoCode, deletePromoCode, validatePromoCode } = require('../controllers/promoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all promo codes
router.get('/all', getAllPromoCodes);

// Validate promo code
router.get('/validate/:code', validatePromoCode);

// Add new promo code
router.post('/', authMiddleware, addPromoCode);

// Update promo code
router.put('/:id', authMiddleware, updatePromoCode);

// Delete promo code
router.delete('/:id', authMiddleware, deletePromoCode);

module.exports = router;