const express = require('express');
const router = express.Router();
// const Product = require('../models/Product'); // Import Product model when ready to fetch from DB

// @route   GET api/products
// @desc    Get all products (placeholder)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // const products = await Product.findAll(); // Later, fetch from database
    // res.json(products);
    res.json([{ id: 1, nome: "Prodotto Esempio 1", prezzo: 10.99 }, { id: 2, nome: "Prodotto Esempio 2", prezzo: 22.50 }]); // Placeholder data
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
