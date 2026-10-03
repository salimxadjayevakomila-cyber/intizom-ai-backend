 const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    steps: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: String,
      default: '5 min',
    },
  },
  {
    _id: true,
  }
)

const stepSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    date: {
      type: String,
      required: true,
      index: true,
    },

    steps: {
      type: Number,
      default: 0,
      min: 0,
    },

    hourlySteps: {
      type: [Number],
      default: () => Array(12).fill(0),
    },

    activities: {
      type: [activitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

stepSchema.index(
  { user: 1, date: 1 },
  { unique: true }
)

module.exports = mongoose.model('Step', stepSchema)