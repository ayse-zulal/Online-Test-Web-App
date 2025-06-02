const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM questions');
  res.json(result.rows);
});

router.get('/:testid', async (req, res) => {
  const { testid } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM questions WHERE testid = $1 ORDER BY questionid ASC`,
      [testid]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Questions fetch error:', err);
    res.status(500).json({ error: 'Sorular alınamadı' });
  }
});

module.exports = router;
