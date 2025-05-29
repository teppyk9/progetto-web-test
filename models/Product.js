const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
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
  prezzo: {
    type: DataTypes.DECIMAL(10, 2), // Precision 10, scale 2 for currency
    allowNull: false,
  },
  immagineUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Or false if an image is always required
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Eventually, you might want to add a foreign key for Artisan
  // artisanId: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: 'artisans', // Name of the Artisan table
  //     key: 'id',
  //   }
  // },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
