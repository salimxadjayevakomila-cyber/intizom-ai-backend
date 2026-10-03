const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    currentWeight: {
      type: Number,
      default: 0,
    },

    goalWeight: {
      type: Number,
      default: 0,
    },

    startWeight: {
      type: Number,
      default: 0,
    },

    calories: {
      type: Number,
      default: 2000,
    },

    protein: {
      type: Number,
      default: 140,
    },

    carbs: {
      type: Number,
      default: 220,
    },

    fat: {
      type: Number,
      default: 65,
    },

    steps: {
      type: Number,
      default: 10000,
    },

    water: {
      type: Number,
      default: 2.5,
    },
  },
  {
    timestamps: true,
  }
)

module.exports =
  mongoose.model('Goal', goalSchema)