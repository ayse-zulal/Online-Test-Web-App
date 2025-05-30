const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM tests');
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const testId = req.params.id;

  try {
    const testResult = await db.query('SELECT * FROM tests WHERE testid = $1', [testId]);
    if (testResult.rows.length === 0) {
      return res.status(404).json({ error: 'Test bulunamadı' });
    }

    const test = testResult.rows[0];

    const questionsResult = await db.query('SELECT * FROM questions WHERE testid = $1', [testId]);
    const questions = questionsResult.rows;

    let creator = null;
    if (test.creatorid) {
      const creatorResult = await db.query('SELECT username FROM users WHERE userid = $1', [test.creatorid]);
      creator = creatorResult.rows[0] || null;
    }

    res.json({
      test,
      questions,
      creator,
    });
  } catch (err) {
    console.error('Test detay hatası:', err.message);
    res.status(500).json({ error: 'Test bilgisi alınırken bir hata oluştu' });
  }
});

router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await db.query('SELECT * FROM tests WHERE creatorid = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Kullanıcının testleri alınamadı:', err.message);
    res.status(500).json({ error: 'Kullanıcının testleri alınırken bir hata oluştu' });
  }
});

router.post('/create', async (req, res) => {
  const { title, userId, description, image, questions } = req.body;

  try {
    const testResult = await db.query(
      'INSERT INTO tests (title, creatorid, description, image,createdat) VALUES ($1, $2, $3, $4, NOW()) RETURNING testid',
      [title, userId, description, image]
    );
    const testId = testResult.rows[0].testid;

    for (const q of questions) {
      const qRes = await db.query(
        'INSERT INTO questions (testid, questiontext, questiontype, correctanswer, options, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING questionid',
        [testId, q.questionText, q.questionType, q.correctAnswer, q.options, q.image]
      );
    }

    res.json({ success: true, testId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Test oluşturulamadı' });
  }
});

module.exports = router;
