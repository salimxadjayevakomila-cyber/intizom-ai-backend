 const Meal = require('../models/Meals');

// Ovqat qo'shish
exports.addMeal = async (req, res) => {
  try {
    const {
      foodName,
      calories,
      carbs,
      protein,
      fat,
      imageUrl,
    } = req.body;

    // JWT orqali kelgan user
    const userId = req.user.id;

    if (!foodName || calories === undefined) {
      return res.status(400).json({
        success: false,
        message: 'foodName va calories kiritilishi shart!',
      });
    }

    const meal = await Meal.create({
      user: userId,
      foodName,
      calories: Number(calories),
      carbs: Number(carbs) || 0,
      protein: Number(protein) || 0,
      fat: Number(fat) || 0,
      imageUrl: imageUrl || '',
    });

    res.status(201).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    console.error('Add meal error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Bugungi ovqatlarni olish
exports.getTodayMeals = async (req, res) => {
  try {
    // URL'dan userId OLMAYMIZ
    const userId = req.user.id;

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const meals = await Meal.find({
      user: userId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: meals,
    });
  } catch (error) {
    console.error('Get meals error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Ovqatni o'chirish
exports.deleteMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Faqat LOGIN qilgan userning ovqatini o'chirish
    const deletedMeal = await Meal.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deletedMeal) {
      return res.status(404).json({
        success: false,
        message: 'Ovqat topilmadi',
      });
    }

    res.status(200).json({
      success: true,
      message: "Ovqat muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.error('Delete meal error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};