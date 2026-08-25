const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.me);
router.post('/apikey', authenticateToken, authController.updateApiKey);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/settings', authenticateToken, authController.updateSettings);

module.exports = router;
