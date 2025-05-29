const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
  // You could link this to a User account if artisans are also users
  // userId: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: 'users',
  //     key: 'id',
  //   }
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
  tableName: 'artisans',
  timestamps: true,
});

// Define associations later if needed, e.g.:
// Artisan.hasMany(Product, { foreignKey: 'artisanId' });
// Product.belongsTo(Artisan, { foreignKey: 'artisanId' });

module.exports = Artisan;
