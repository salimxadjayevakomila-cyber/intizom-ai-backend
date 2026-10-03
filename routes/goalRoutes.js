const express = require('express')

const router = express.Router()

const {
  getGoals,
  updateGoals,
} = require('../controllers/goalController')

const authMiddleware = require('../middleware/authMiddleware')

// GET /api/goals
router.get(
  '/',
  authMiddleware,
  getGoals
)

// PUT /api/goals
router.put(
  '/',
  authMiddleware,
  updateGoals
)

module.exports = router