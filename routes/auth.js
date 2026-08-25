const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/forgot-password', authController.forgotPassword);
router.get('/me', authenticateToken, authController.me);
router.post('/apikey', authenticateToken, authController.updateApiKey);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/settings', authenticateToken, authController.updateSettings);
router.post('/test-drive', authenticateToken, authController.testDriveConnection);

module.exports = router;
