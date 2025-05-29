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

// Sync database and then start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized successfully with models (alter: true).');
    // Start the server only after successful sync
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
    // Optionally, exit the process if DB sync fails
    // process.exit(1); 
  });
