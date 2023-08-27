const mongoose = require("mongoose");
const colors = require("colors");

// 2.
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
  } catch (error) {
    
  }
};


// last
module.exports = connectDB;