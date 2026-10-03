const Meal = require('../models/Meals')
const Step = require('../models/Step')

const getDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

exports.getInsights = async (req, res) => {
  try {
    const userId = req.user.id

    const today = new Date()

    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 6)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(today)
    endDate.setHours(23, 59, 59, 999)

    const meals = await Meal.find({
      user: userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: 1 })

    const steps = await Step.find({
      user: userId,
      date: {
        $gte: getDateKey(startDate),
        $lte: getDateKey(endDate),
      },
    }).sort({ date: 1 })

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const weeklyData = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const dateKey = getDateKey(date)

      const dayMeals = meals.filter(
        (meal) =>
          getDateKey(new Date(meal.createdAt)) === dateKey
      )

      const daySteps = steps.find(
        (item) => item.date === dateKey
      )

      const consumed = dayMeals.reduce(
        (sum, meal) => sum + (Number(meal.calories) || 0),
        0
      )

      const protein = dayMeals.reduce(
        (sum, meal) => sum + (Number(meal.protein) || 0),
        0
      )

      const carbs = dayMeals.reduce(
        (sum, meal) => sum + (Number(meal.carbs) || 0),
        0
      )

      const fat = dayMeals.reduce(
        (sum, meal) => sum + (Number(meal.fat) || 0),
        0
      )

      weeklyData.push({
        day: dayNames[date.getDay()],
        date: dateKey,
        burned: Math.round(
          (Number(daySteps?.steps) || 0) * 0.04
        ),
        consumed,
        steps: Number(daySteps?.steps) || 0,
        protein,
        carbs,
        fat,
      })
    }

    const totalSteps = weeklyData.reduce(
      (sum, day) => sum + day.steps,
      0
    )

    const totalConsumed = weeklyData.reduce(
      (sum, day) => sum + day.consumed,
      0
    )

    const totalBurned = weeklyData.reduce(
      (sum, day) => sum + day.burned,
      0
    )

    const totalProtein = weeklyData.reduce(
      (sum, day) => sum + day.protein,
      0
    )

    const totalCarbs = weeklyData.reduce(
      (sum, day) => sum + day.carbs,
      0
    )

    const totalFat = weeklyData.reduce(
      (sum, day) => sum + day.fat,
      0
    )

    const macroTotal =
      totalProtein +
      totalCarbs +
      totalFat

    const macroBreakdown = [
      {
        name: 'Protein',
        value:
          macroTotal > 0
            ? Math.round(
                (totalProtein / macroTotal) * 100
              )
            : 0,
        grams: Math.round(totalProtein),
        color: '#34d399',
      },
      {
        name: 'Carbs',
        value:
          macroTotal > 0
            ? Math.round(
                (totalCarbs / macroTotal) * 100
              )
            : 0,
        grams: Math.round(totalCarbs),
        color: '#5ac4a4',
      },
      {
        name: 'Fat',
        value:
          macroTotal > 0
            ? Math.round(
                (totalFat / macroTotal) * 100
              )
            : 0,
        grams: Math.round(totalFat),
        color: '#f4bf77',
      },
    ]

    const daysWithData =
      weeklyData.filter(
        (day) =>
          day.steps > 0 ||
          day.consumed > 0
      ).length || 1

    res.status(200).json({
      success: true,
      data: {
        weeklyData,
        macroBreakdown,

        averages: {
          avgBurned: Math.round(
            totalBurned / 7
          ),
          avgConsumed: Math.round(
            totalConsumed / 7
          ),
          totalSteps,
        },

        daysWithData,
      },
    })
  } catch (error) {
    console.error(
      'Get insights error:',
      error
    )

    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}