const express = require('express');

const router = express.Router();

const {
  saveFcmToken,
  sendTestNotification,
} = require('../controllers/notificationController');

const authMiddleware = require('../middleware/authMiddleware');

router.post(
  '/token',
  authMiddleware,
  saveFcmToken
);

router.post(
  '/test',
  authMiddleware,
  sendTestNotification
);

module.exports = router;