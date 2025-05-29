const { Sequelize } = require('sequelize');

// Replace with your actual database credentials and details
const sequelize = new Sequelize('artigianato_online_db', 'your_username', 'your_password', {
  host: 'localhost', // Or your database host
  dialect: 'postgres',
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
