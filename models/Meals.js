 const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  foodName: { 
    type: String, 
    required: true 
  },
  calories: { 
    type: Number, 
    required: true 
  },
  carbs: { 
    type: Number, 
    default: 0 
  },
  protein: { 
    type: Number, 
    default: 0 
  },
  fat: { 
    type: Number, 
    default: 0 
  },
  imageUrl: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Meal', mealSchema);