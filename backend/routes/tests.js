const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM tests');
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const testId = req.params.id;

  const test = await db.query('SELECT * FROM tests WHERE id = $1', [testId]);
  const questions = await db.query('SELECT * FROM questions WHERE test_id = $1', [testId]);

  res.json({
    test: test.rows[0],
    questions: questions.rows,
  });
});

module.exports = router;
