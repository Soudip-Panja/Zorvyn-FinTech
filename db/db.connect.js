const mongoose = require("mongoose");
require("dotenv").config();

const MongoUrl = process.env.MONGODB;

const initializeDatabase = async () => {
  try {
    await mongoose.connect(MongoUrl);
    console.log("Connected to database.");
  } catch (error) {
    console.log("Database connection failed!", error);
    process.exit(1);
  }
};

module.exports = { initializeDatabase };
