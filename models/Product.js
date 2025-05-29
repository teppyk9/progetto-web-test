const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// const Artisan = require('./Artisan'); // Import Artisan model
// Cart and OrderItem will be imported later to avoid circular dependencies if they also import Product
// For now, we'll use sequelize.models for them in associations if needed immediately,
// but ideally, associations are defined after all models are defined and registered.

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
  artisanId: { // Foreign key for Artisan
    type: DataTypes.INTEGER,
    references: {
      model: 'artisans', // Name of the Artisan table
      key: 'id',
    }
  },
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

// Define associations
// Product.belongsTo(Artisan, { foreignKey: 'artisanId' });

// Associations to Cart and OrderItem will be added after ensuring those models are defined
// to avoid circular dependency issues with require().
// This is often handled by calling an associate method on each model after all models are loaded,
// or by using sequelize.models.ModelName.

module.exports = Product;

// Late define associations that might cause circular dependencies
// This is a common pattern: define models, export them, then require and associate them.
// However, for this tool, I need to put everything in one go.
// Let's try requiring them and see if the environment handles it.
// If not, using sequelize.models within the association is the fallback.

// const Cart = require('./Cart');
// const OrderItem = require('./OrderItem');

// Product.hasMany(Cart, { foreignKey: 'productId' });
// Product.hasMany(OrderItem, { foreignKey: 'productId' });
