const express = require('express');
const router = express.Router();
const { getNearbyGyms } = require('../controllers/gymController');

// O'zbekistondagi 15 ta sport zal ro'yxatini olish
router.get('/', getNearbyGyms);

module.exports = router;