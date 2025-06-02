const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM answers');
  res.json(result.rows);
});

router.get('/:submissionid', async (req, res) => {
  const { submissionid } = req.params;

  try {
    const result = await db.query(
      `SELECT q.questiontext, a.answertext
       FROM answers a
       JOIN questions q ON a.questionid = q.questionid
       WHERE a.submissionid = $1
       ORDER BY q.questionid ASC`,
      [submissionid]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Answers fetch error:', err);
    res.status(500).json({ error: 'Cevaplar alınamadı' });
  }
});

module.exports = router;
