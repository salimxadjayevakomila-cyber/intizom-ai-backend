 const express = require('express');

const router = express.Router();

const {
  register,
  login,
  updateProfile,
  getAllUsers,
} = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Profile — faqat login qilgan user
router.put(
  '/profile',
  authMiddleware,
  updateProfile
);

// Hozircha userlar ro'yxati
router.get('/', getAllUsers);

module.exports = router;