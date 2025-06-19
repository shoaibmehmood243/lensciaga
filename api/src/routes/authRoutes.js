const express = require('express');
const router = express.Router();
const { adminLogin, registerAdmin } = require('../controllers/authConrtoller');

router.post('/login', adminLogin);
router.post('/register', registerAdmin);

module.exports = router;