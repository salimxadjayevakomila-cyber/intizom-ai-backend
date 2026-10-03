 const express = require('express');

const router = express.Router();

const {
  addMeal,
  getTodayMeals,
  deleteMeal,
} = require('../controllers/mealController');

const authMiddleware = require('../middleware/authMiddleware');

// Faqat login qilgan user
router.post(
  '/',
  authMiddleware,
  addMeal
);

router.get(
  '/',
  authMiddleware,
  getTodayMeals
);

router.delete(
  '/:id',
  authMiddleware,
  deleteMeal
);

module.exports = router;