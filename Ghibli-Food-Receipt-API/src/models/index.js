// src/models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const config = require('../config/config'); // Your application config
const dbConfig = require('../config/database.js')[config.env || 'development']; // Sequelize-CLI compatible config

const db = {}; // Initialize db object first

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

// Load all model files from the current directory
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    // Import the model definition function
    const modelDefinition = require(path.join(__dirname, file));
    // Call the function to define the model and add it to the db object
    const model = modelDefinition(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Call associate methods if they exist on the models
Object.values(db).forEach(model => {
  if (model && typeof model.associate === 'function') {
    model.associate(db); // Pass the entire db object
  }
});

// Add Sequelize instance and Sequelize library itself to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;