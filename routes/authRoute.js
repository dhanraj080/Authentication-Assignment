const express = require('express');
const multer = require('multer');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Configuring multer for image upload
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Only PNG and JPG format images are allowed!'), false);
        }
    }
});

// Public routes
router.post('/register', upload.single('profileImage'), authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);

// Protected routes
router.get('/dashboard', authenticateToken, authController.dashboard);
router.get('/profile-image', authenticateToken, authController.getProfileImage);
router.delete('/delete-account', authenticateToken, authController.deleteAccount);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;