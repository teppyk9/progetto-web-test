const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// const User = require('./User');
// const Product = require('./Product');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Name of the User table
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products', // Name of the Product table
      key: 'id',
    },
  },
  quantita: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
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
  tableName: 'cart_items', // Using 'cart_items' as table name for clarity
  timestamps: true,
});

// Define associations
// Cart.belongsTo(User, { foreignKey: 'userId' });
// Cart.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Cart;
