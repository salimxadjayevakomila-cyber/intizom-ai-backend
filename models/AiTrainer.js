 const mongoose = require('mongoose')

const aiTrainerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    fitnessLevel: {
      type: String,
      enum: [
        'beginner',
        'intermediate',
        'advanced',
      ],
      default: 'beginner',
    },

    activityLevel: {
      type: String,
      enum: [
        'low',
        'normal',
        'active',
      ],
      default: 'normal',
    },

    preferredActivity: {
      type: String,
      default: 'general movement',
    },

    availableDays: {
      type: String,
      default: 'flexible',
    },

    focus: {
      type: String,
      default: 'healthy habits',
    },

    plan: {
      type: String,
      default: '',
    },

    lastGeneratedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

module.exports =
  mongoose.model(
    'AITrainer',
    aiTrainerSchema,
  )