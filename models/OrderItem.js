const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');
const Product = require('./Product');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders', // Name of the Order table
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
  prezzoAlMomentoDellOrdine: { // Price at the time of order, in case product price changes
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
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
  tableName: 'order_items',
  timestamps: true,
});

// Define associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = OrderItem;
