 const User = require('../models/User')

const {
  getMessaging,
} = require('firebase-admin/messaging')

require('../config/firebaseAdmin')

// FCM tokenni userga saqlash
exports.saveFcmToken = async (req, res) => {
  try {
    const userId = req.user.id
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'FCM token kerak',
      })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
      })
    }

    user.fcmToken = token

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'FCM token muvaffaqiyatli saqlandi',
    })
  } catch (error) {
    console.error(
      'Save FCM token error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'FCM tokenni saqlashda xatolik',
      error: error.message,
    })
  }
}

// Test notification yuborish
exports.sendTestNotification = async (
  req,
  res
) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
      })
    }

    if (!user.fcmToken) {
      return res.status(400).json({
        success: false,
        message:
          'Bu userda FCM token mavjud emas',
      })
    }

    const message = {
      token: user.fcmToken,

      notification: {
        title: 'INTIZOM AI 🔥',
        body: 'Notification ishlayapti!',
      },

      webpush: {
        notification: {
          title: 'INTIZOM AI 🔥',
          body: 'Notification ishlayapti!',
          icon: '/icon-192.png',
        },
      },
    }

    const response =
      await getMessaging().send(message)

    return res.status(200).json({
      success: true,
      message: 'Notification yuborildi',
      response,
    })
  } catch (error) {
    console.error(
      'Send notification error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Notification yuborishda xatolik',
      error: error.message,
    })
  }
}