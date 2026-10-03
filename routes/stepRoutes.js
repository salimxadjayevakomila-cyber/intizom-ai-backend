 const express = require('express')

const router = express.Router()

const {
  getTodaySteps,
  addSteps,
} = require('../controllers/stepController')

const authMiddleware = require('../middleware/authMiddleware')

// Bugungi qadamlarni olish
router.get(
  '/',
  authMiddleware,
  getTodaySteps
)

// Yangi qadam qo‘shish
router.post(
  '/',
  authMiddleware,
  addSteps
)

module.exports = router