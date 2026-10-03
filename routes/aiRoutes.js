 const express = require('express')

const router = express.Router()

const {
  analyzeFood,
  chatWithAI,
  getTrainerPlan,
} = require('../controllers/aiController')

const authMiddleware = require('../middleware/authMiddleware')


// ============================================================
// 1. AI FOOD SCANNER
// ============================================================

// POST /api/ai/analyze
router.post(
  '/analyze',
  authMiddleware,
  analyzeFood
)

// POST /api/ai/analyze-food
router.post(
  '/analyze-food',
  authMiddleware,
  analyzeFood
)


// ============================================================
// 2. AI CHATBOT
// ============================================================

// POST /api/ai/chat
router.post(
  '/chat',
  authMiddleware,
  chatWithAI
)


// ============================================================
// 3. AI TRAINER
// ============================================================

// POST /api/ai/trainer
router.post(
  '/trainer',
  authMiddleware,
  getTrainerPlan
)


module.exports = router