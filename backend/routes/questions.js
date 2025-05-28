const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM questions');
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const questionId = req.params.id;

  const question = await db.query('SELECT * FROM questions WHERE id = $1', [questionId]);

  res.json({
    question: question.rows[0],
  });
});

module.exports = router;
