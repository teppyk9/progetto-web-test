const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating tokens

// @route   POST api/auth/register
// @desc    Register a new user (placeholder)
// @access  Public
router.post('/register', async (req, res) => {
  const { nome, email, password } = req.body;
  //Basic validation (add more robust validation later)
  if (!nome || !email || !password) {
  return res.status(400).json({ msg: 'Inserire tutti i campi' });
  }
  try {
    // Placeholder response
    res.status(201).json({ msg: 'User registration endpoint (placeholder)' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Errore del server');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token (placeholder)
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
  return res.status(400).json({ msg: 'Inserire tutti i campi' });
  }
  try {
    // Placeholder response
    res.json({ token: 'fake_jwt_token', msg: 'Login endpoint (placeholder)' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Errore del server');
  }
});

module.exports = router;
