const express = require('express');
const router = express.Router();
const { placeOrder, getAllOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', placeOrder);
router.put('/:id', updateOrderStatus);
router.get('/all', authMiddleware, getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;