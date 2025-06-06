const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/orders
// @desc    Get user's orders (placeholder)
// @access  Private
router.get('/', /* authMiddleware, */ async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.user.id } });
    res.json(orders);
    res.json([{ id: 1, dataOrdine: new Date(), stato: "Spedito", totale: 75.00 }]); // Placeholder
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Errore del server');
  }
});

// @route   POST api/orders
// @desc    Create a new order (placeholder)
// @access  Private
router.post('/', /* authMiddleware, */ async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body; // items from cart
  const userId = req.user.id;
  try {
    // Placeholder
    res.status(201).json({ msg: 'Ordine creato (placeholder)', orderId: Date.now() });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Errore del server');
  }
});

module.exports = router;
