const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming db.js exports sequelize instance

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Timestamps
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users', // Table name in the database
  timestamps: true, // Enables createdAt and updatedAt fields
});

// Associations
// Need to require models here to avoid circular dependencies if they also require User.
// This is often done in a separate association setup file or after all models are defined.
const Cart = require('./Cart');
const Order = require('./Order');
const Artisan = require('./Artisan');

User.hasMany(Cart, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });
User.hasOne(Artisan, { foreignKey: 'userId' }); // An artisan profile is linked to a user account

module.exports = User;
