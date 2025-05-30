// src/server.js
const http = require('http');
const config = require('./config/config'); // Updated import
const app = require('./app');
const { sequelize } = require('./models');

const port = config.port || 5000;
const server = http.createServer(app);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync();
    console.log('Database synchronized.');

    server.listen(port, () => {
      console.log(`Server running on port ${port} in ${config.env} mode`);
      console.log(`API available at http://localhost:${port}/api/v1`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
    process.exit(1);
  }
}

startServer();