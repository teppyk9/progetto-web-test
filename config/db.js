const { Sequelize } = require('sequelize');

// Replace with your actual database credentials and details
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST, // Or your database host
  dialect: 'postgres',
  port: process.env.DB_PORT, // Add port from environment variable
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error);
  }
}

testConnection();

module.exports = sequelize;
