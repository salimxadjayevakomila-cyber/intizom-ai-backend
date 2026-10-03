 const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Route fayllarni import qilish
const userRoutes = require('./routes/userRoutes');
const mealRoutes = require('./routes/mealRoutes');
const aiRoutes = require('./routes/aiRoutes');
const stepRoutes = require('./routes/stepRoutes'); // <--- Step Counter uchun qo'shildi
const gymRoutes = require('./routes/gymRoutes');
const goalRoutes = require('./routes/goalRoutes');
const insightRoutes = require('./routes/insightRoutes')

// MongoDB ga ulanish
connectDB();

const app = express();

// Middleware'lar
app.use(cors());
app.use(express.json({ limit: '20mb' })); // AI rasm yuklashi uchun limit
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// API Route'lar
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/steps', stepRoutes); // <--- Step Counter route'i ulandi
app.use('/api/gyms', gymRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/insights', insightRoutes)

// Test endpoint
app.get('/', (req, res) => {
  res.send('INTIZOM AI Backend serveri muvaffaqiyatli ishlamoqda! 🚀');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi 🚀`);
});