const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password, createdat) VALUES ($1, $2, $3, $4)',
      [username, email, hashed, new Date()]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Error in registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Password is incorrect' });

    const token = jwt.sign({ id: user.userid }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.userid, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Error during login' });
  }
});


router.get("/me", verifyToken, (req, res) => {
  res.json({ message: "Access granted", userId: req.user.id });
});



module.exports = router;
