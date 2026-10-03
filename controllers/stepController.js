 const Step = require('../models/Step')

const getToday = () => {
  const now = new Date()

  const year = now.getFullYear()

  const month = String(
    now.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    now.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getEmptyHourlySteps = () =>
  Array(12).fill(0)

// GET /api/steps
// Bugungi qadamlarni olish
exports.getTodaySteps = async (
  req,
  res
) => {
  try {
    const userId = req.user.id
    const date = getToday()

    let stepData =
      await Step.findOne({
        user: userId,
        date,
      })

    if (!stepData) {
      stepData = await Step.create({
        user: userId,
        date,
        steps: 0,
        hourlySteps:
          getEmptyHourlySteps(),
        activities: [],
      })
    }

    res.status(200).json({
      success: true,
      data: stepData,
    })
  } catch (error) {
    console.error(
      'Get steps error:',
      error
    )

    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// POST /api/steps
// Qadam qo‘shish
exports.addSteps = async (
  req,
  res
) => {
  try {
    const userId = req.user.id
    const date = getToday()

    const {
      steps,
      duration,
      label,
    } = req.body

    const additionalSteps =
      Number(steps)

    if (
      !additionalSteps ||
      additionalSteps <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Qadam soni 0 dan katta bo‘lishi kerak',
      })
    }

    let stepData =
      await Step.findOne({
        user: userId,
        date,
      })

    if (!stepData) {
      stepData = await Step.create({
        user: userId,
        date,
        steps: 0,
        hourlySteps:
          getEmptyHourlySteps(),
        activities: [],
      })
    }

    // Umumiy qadamni oshirish
    stepData.steps +=
      additionalSteps

    // Hozirgi vaqt
    const now = new Date()

    const time = now.toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    )

    // 07:00 dan boshlanadigan
    // 12 ta soatlik slot
    const hour = now.getHours()

    const index = hour - 7

    if (
      index >= 0 &&
      index < 12
    ) {
      stepData.hourlySteps[
        index
      ] =
        (stepData.hourlySteps[
          index
        ] || 0) +
        additionalSteps
    }

    // Activity qo‘shish
    stepData.activities.unshift({
      time,

      label:
        label ||
        'Manual walk step',

      steps:
        additionalSteps,

      duration:
        duration || '5 min',
    })

    await stepData.save()

    res.status(200).json({
      success: true,
      data: stepData,
    })
  } catch (error) {
    console.error(
      'Add steps error:',
      error
    )

    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}