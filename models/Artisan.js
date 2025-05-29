const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// const User = require('./User'); // Import User model
// const Product = require('./Product'); // Import Product model

const Artisan = sequelize.define('Artisan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descrizione: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: { // Optional: if artisans have separate accounts or contact
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  userId: { // Link to a User account
    type: DataTypes.INTEGER,
    unique: true, // Add this line
    references: {
      model: 'users', // Name of the User table
      key: 'id',
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'artisans',
  timestamps: true,
});

// Define associations
// Artisan.belongsTo(User, { foreignKey: 'userId' });
// Artisan.hasMany(Product, { foreignKey: 'artisanId' });

module.exports = Artisan;
