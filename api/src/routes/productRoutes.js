const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.post('/', authMiddleware, upload, addProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', authMiddleware, upload, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;