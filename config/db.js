const { Sequelize } = require('sequelize');

// Replace with your actual database credentials and details
const sequelize = new Sequelize(process.env.DATABASE_URL, {
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
    console.log('La connessione a PostgreSQL è stata stabilita con successo.');
  } catch (error) {
    console.error('Impossibile connettersi al database PostgreSQL:', error);
  }
}

// testConnection(); // Commented out as server.js will handle sync

module.exports = sequelize;
