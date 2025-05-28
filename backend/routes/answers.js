const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM answers');
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const answerId = req.params.id;

  const answer = await db.query('SELECT * FROM answers WHERE id = $1', [answerId]);

  res.json({
    question: question.rows[0],
  });
});

module.exports = router;
