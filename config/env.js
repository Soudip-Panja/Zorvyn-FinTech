require("dotenv").config();

module.exports = {
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL: process.env.EMAIL,
  PORT: process.env.PORT || 3000,
};
