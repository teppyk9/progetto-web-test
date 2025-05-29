const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// const User = require('./User'); // Import User model for association

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: { // Foreign key for User
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Name of the User table
      key: 'id',
    },
  },
  dataOrdine: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  stato: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending', // e.g., Pending, Processing, Shipped, Delivered, Cancelled
  },
  totale: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  // Shipping address details can be added here or in a separate model
  // shippingAddress: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'orders',
  timestamps: true,
});

// Define associations
// Order.belongsTo(User, { foreignKey: 'userId' });
// User.hasMany(Order, { foreignKey: 'userId' });

// Order will also have many OrderItems
// Order.hasMany(OrderItem, { foreignKey: 'orderId' });

module.exports = Order;
