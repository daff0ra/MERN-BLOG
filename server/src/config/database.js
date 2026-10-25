const mongoose = require('mongoose');

module.exports = async function connectDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
};
