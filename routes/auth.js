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
router.post('/signature', authenticateToken, authController.updateSignature);
router.put('/settings', authenticateToken, authController.updateSettings);
router.post('/test-drive', authenticateToken, authController.testDriveConnection);

router.post('/test-smtp', authenticateToken, authController.testSmtpConnection);
router.post('/test-google', authenticateToken, authController.testGoogleConnection);

router.get('/google/config', authController.getGoogleConfig);
router.get('/google', authController.googleAuthRedirect);
router.get('/google/callback', authController.googleAuthCallback);

module.exports = router;
