const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.post('/create', async (req, res) => {
  const { testId, submittername, answers } = req.body;
  console.log('Received submission:', { testId, submittername, answers });

  if (!name?.trim() || answers.some(a => !a.answerText?.trim())) {
    return res.status(400).json({ error: 'İsim ve tüm cevaplar doldurulmalıdır.' });
  }

  try {
    const submissionRes = await db.query(
      'INSERT INTO submissions (testid, submittedat, submittername) VALUES ($1, NOW(), $2) RETURNING submissionid',
      [testId, submittername.trim()]
    );

    const submissionId = submissionRes.rows[0].submissionid;

    for (const ans of answers) {
      await db.query(
        'INSERT INTO answers (submissionid, questionid, answertext) VALUES ($1, $2, $3)',
        [submissionId, ans.questionId, ans.answerText.trim()]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Test gönderilemedi' });
  }
});


router.get('/leaderboard/:testid', async (req, res) => {
  const { testid } = req.params;

  try {
    const result = await db.query(`
      SELECT 
        s.submissionid,
        s.submittername,
        s.submittedat,
        COUNT(*) FILTER (WHERE a.answertext = q.correctanswer) AS correct_count
      FROM submissions s
      JOIN answers a ON s.submissionid = a.submissionid
      JOIN questions q ON a.questionid = q.questionid
      WHERE s.testid = $1
      GROUP BY s.submissionid, s.submittername, s.submittedat
      ORDER BY correct_count DESC, s.submittedat ASC
    `, [testid]);

    res.json(result.rows);
  } catch (err) {
    console.error('Leaderboard fetch error:', err);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

module.exports = router;
