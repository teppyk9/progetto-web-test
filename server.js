require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./config/db'); // Sequelize instance

// Import models to register them with Sequelize
require('./models/User');
require('./models/Artisan');
require('./models/Product');
require('./models/Cart');
require('./models/Order');
require('./models/OrderItem');

// Define Associations
const { User, Artisan, Product, Cart, Order, OrderItem } = sequelize.models;

// Artisan associations
Artisan.belongsTo(User, { foreignKey: 'userId' });
Artisan.hasMany(Product, { foreignKey: 'artisanId' });

// User associations
User.hasMany(Cart, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });
User.hasOne(Artisan, { foreignKey: 'userId' });

// Product associations
Product.belongsTo(Artisan, { foreignKey: 'artisanId' });
Product.hasMany(Cart, { foreignKey: 'productId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });

// Cart associations
Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

// Order associations
Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic test route
app.get('/', (req, res) => {
  res.send('Il server di Artigianato Online è in esecuzione!');
});

// Define Routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Sync database and then start server
sequelize.sync({ alter: true })
    .then(() => {
        console.log('📦 Database sincronizzato con successo!');
        app.listen(PORT, async () => {
            try {
                await sequelize.authenticate();
                console.log('La connessione a PostgreSQL è stata stabilita con successo.');
            } catch (error) {
                console.error('Impossibile connettersi al database PostgreSQL:', error);
            }
            console.log(`✅ Server attivo sulla porta ${PORT}`);
            console.log(`🌐 Accedi al sito su: http://localhost:${PORT}/index.html`);
        });
    })
    .catch(err => {
        console.error('❌ Errore nella sincronizzazione del database:', err);
    });
