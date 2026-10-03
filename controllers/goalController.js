const Goal = require('../models/Goal')
const User = require('../models/User')

// GET /api/goals
exports.getGoals = async (req, res) => {
  try {
    const userId = req.user.id

    let goals = await Goal.findOne({
      user: userId,
    })

    if (!goals) {
      const user = await User.findById(userId)

      goals = await Goal.create({
        user: userId,

        currentWeight:
          Number(user?.weight) || 0,

        startWeight:
          Number(user?.weight) || 0,

        goalWeight:
          Number(user?.weight) || 0,

        calories:
          Number(user?.dailyGoalCalories) || 2000,

        protein: 140,
        carbs: 220,
        fat: 65,
        steps: 10000,
        water: 2.5,
      })
    }

    res.status(200).json({
      success: true,
      data: goals,
    })
  } catch (error) {
    console.error(
      'Get goals error:',
      error
    )

    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// PUT /api/goals
exports.updateGoals = async (req, res) => {
  try {
    const userId = req.user.id

    const {
      currentWeight,
      goalWeight,
      startWeight,
      calories,
      protein,
      carbs,
      fat,
      steps,
      water,
    } = req.body

    const goals =
      await Goal.findOneAndUpdate(
        { user: userId },
        {
          $set: {
            currentWeight:
              Number(currentWeight) || 0,

            goalWeight:
              Number(goalWeight) || 0,

            startWeight:
              Number(startWeight) || 0,

            calories:
              Number(calories) || 0,

            protein:
              Number(protein) || 0,

            carbs:
              Number(carbs) || 0,

            fat:
              Number(fat) || 0,

            steps:
              Number(steps) || 0,

            water:
              Number(water) || 0,
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )

    res.status(200).json({
      success: true,
      data: goals,
    })
  } catch (error) {
    console.error(
      'Update goals error:',
      error
    )

    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}