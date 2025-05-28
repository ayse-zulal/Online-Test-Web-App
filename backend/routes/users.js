const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM users');
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  const user = await db.query('SELECT * FROM users WHERE userid = $1', [userId]);

  res.json({
    user: user.rows[0],
  });
});

module.exports = router;


