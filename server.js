require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./config/db'); // Sequelize instance

// Import models (optional here, but good for structure)
// const User = require('./models/User');
// const Product = require('./models/Product');
// const Artisan = require('./models/Artisan');
// const Order = require('./models/Order');
// const OrderItem = require('./models/OrderItem');
// const Cart = require('./models/Cart');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic test route
app.get('/', (req, res) => {
  res.send('Artigianato Online server is running!');
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

// Database connection and server start
async function startServer() {
  try {
    // await sequelize.sync({ alter: true }); // Sync models with DB - use with caution, alter can modify tables. Consider migrations for production.
    // For now, we'll just test the connection as db.js already does.
    await sequelize.authenticate(); // Ensure DB connection is alive
    console.log('Database connection verified.');
    
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
  }
}

startServer();
