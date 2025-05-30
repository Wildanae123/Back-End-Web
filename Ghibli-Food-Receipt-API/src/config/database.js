// src/config/database.js
const path = require('path');
// Ensure dotenv loads variables from the project root .env file
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const appConfig = require('./config'); // Your existing src/config/config.js

// sequelize-cli expects specific environment keys (development, production, test)
module.exports = {
  development: {
    username: appConfig.db.user,
    password: appConfig.db.password,
    database: appConfig.db.name,
    host: appConfig.db.host,
    port: appConfig.db.port,
    dialect: appConfig.db.dialect,
    // dialectOptions: { // Add if you have specific dialect options e.g. for SSL
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false // Adjust as per your SSL setup
    //   }
    // }
  },
  // You can add 'test' and 'production' configurations here similarly
  // production: {
  //   username: process.env.PROD_DB_USERNAME,
  //   password: process.env.PROD_DB_PASSWORD,
  //   database: process.env.PROD_DB_DATABASE,
  //   host: process.env.PROD_DB_HOST,
  //   dialect: 'postgres',
  //   // ... other production specific options
  // }
};