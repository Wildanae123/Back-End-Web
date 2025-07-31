// src/config/config.js
require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    dialect: "postgres", // For Sequelize
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  // Add Auth0 config if needed directly
  // auth0: {
  //   domain: process.env.AUTH0_DOMAIN,
  //   audience: process.env.AUTH0_AUDIENCE,
  // }
};
