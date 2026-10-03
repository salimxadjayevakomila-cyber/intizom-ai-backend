 const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT token yaratish
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

// Register
exports.register = async (req, res) => {
  try {
    const {
      name,
      age,
      weight,
      height,
      gender,
      password,
    } = req.body;

    if (!name || !age || !weight || !password) {
      return res.status(400).json({
        success: false,
        message: "Barcha majburiy maydonlarni to'ldiring",
      });
    }

    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu ism allaqachon ro‘yxatdan o‘tgan',
      });
    }

    const userHeight =
      height !== undefined && height !== ''
        ? Number(height)
        : 165;

    const userGender =
      gender === 'male' || gender === 'female'
        ? gender
        : 'female';

    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // User yaratish
    // Bu yerda BMR yoki dailyGoalCalories hisoblanmaydi.
    const user = await User.create({
      name: name.trim(),
      password: hashedPassword,
      age: Number(age),
      weight: Number(weight),
      height: userHeight,
      gender: userGender,
      role: 'user',
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        goal: user.goal,
        activity: user.activity,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);

    return res.status(500).json({
      success: false,
      message: 'Ro‘yxatdan o‘tishda xatolik yuz berdi',
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Ism va parolni kiriting',
      });
    }

    const user = await User.findOne({
      name: name.trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Ism yoki parol xato',
      });
    }

    // Eski MongoDB userlarida password bo‘lmasligi mumkin.
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message:
          'Bu akkauntda parol mavjud emas. Yangi akkaunt yarating.',
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Ism yoki parol xato',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        goal: user.goal,
        activity: user.activity,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Login vaqtida xatolik yuz berdi',
    });
  }
};

// Profilni yangilash
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      age,
      weight,
      height,
      gender,
      goal,
      activity,
      password,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
      });
    }

    if (age !== undefined) {
      user.age = Number(age);
    }

    if (weight !== undefined) {
      user.weight = Number(weight);
    }

    if (height !== undefined) {
      user.height = Number(height);
    }

    if (gender !== undefined) {
      user.gender = gender;
    }

    if (goal !== undefined) {
      user.goal = goal;
    }

    if (activity !== undefined) {
      user.activity = activity;
    }

    if (password) {
      user.password = await bcrypt.hash(
        password,
        10
      );
    }

    // Muhim:
    // Bu yerda BMR, dailyGoalCalories,
    // water target yoki macro target hisoblanmaydi.

    await user.save();

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        goal: user.goal,
        activity: user.activity,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      'Update profile error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Profilni yangilashda xatolik yuz berdi',
    });
  }
};

// Barcha userlar
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password');

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(
      'Get all users error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Userlarni olishda xatolik yuz berdi',
    });
  }
};