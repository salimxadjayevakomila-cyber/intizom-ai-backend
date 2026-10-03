 const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB ga muvaffaqiyatli ulandi: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB ulanishda xatolik: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;