const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.post('/:testId/submit', async (req, res) => {
  const testId = req.params.testId;
  const { answers, clientToken } = req.body;

  try {
    const submissionResult = await db.query(
      'INSERT INTO submissions (test_id, client_token) VALUES ($1, $2) RETURNING id',
      [testId, clientToken || uuidv4()]
    );

    const submissionId = submissionResult.rows[0].id;

    for (const answer of answers) {
      await db.query(
        'INSERT INTO answers (submission_id, question_id, answer_text) VALUES ($1, $2, $3)',
        [submissionId, answer.questionId, answer.answerText]
      );
    }

    res.json({ success: true, submissionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Submission failed' });
  }
});

module.exports = router;
