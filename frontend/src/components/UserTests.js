import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserTests.css'; 
const UserTests = ({ userid }) => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [view, setView] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submitters, setSubmitters] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [visibleCountLeaderboard, setVisibleCountLeaderboard] = useState(10);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tests/user/${userid}`).then(res => {
      setTests(res.data);
    });
  }, [userid]);

  const handleViewQuestions = async (testid) => {
    setSelectedTest(testid);
    setView('questions');
    setSelectedSubmission(null);
    const res = await axios.get(`http://localhost:5000/api/questions/${testid}`);
    setQuestions(res.data);
  };

  const handleViewSubmitters = async (testid) => {
    setSelectedTest(testid);
    setView('submitters');
    setSelectedSubmission(null);
    const res = await axios.get(`http://localhost:5000/api/submissions/leaderboard/${testid}`);
    setSubmitters(res.data);
  };

  const handleViewAnswers = async (submissionid) => {
    setSelectedSubmission(submissionid);
    const res = await axios.get(`http://localhost:5000/api/answers/${submissionid}`);
    setAnswers(res.data);
  };

  return (
    <div className="user-tests-container">
        <h2 style={{textAlign:'center'}}>Var Olan Testleriniz</h2>
        {tests.map(test => (
            <div key={test.testid} className="test-card">
            <div className="test-header">
                <img src={test.image}></img>
                <h3>{test.title}</h3>
                <p>{test.description}</p>
            </div>

            <div className="test-actions">
                <button onClick={() => handleViewQuestions(test.testid)}>Soruları Gör</button>
                <button onClick={() => handleViewSubmitters(test.testid)}>Cevaplayanlar</button>
            </div>

            {selectedTest === test.testid && view === 'questions' && (
                <ul className="question-list">
                    {questions.map(q => (
                        <li key={q.questionid} className="question-card">
                            <div className="question-header">
                                <h4>{q.questiontext}</h4>
                                <span className="question-type">
                                {q.questiontype === 'multiple-choice' ? 'Çoktan Seçmeli' : 'Açık Uçlu'}
                                </span>
                            </div>

                            {q.image && (
                                <div className="question-image">
                                <img src={q.image} alt="soru görseli" />
                                </div>
                            )}

                            {q.questiontype === 'multiple-choice' && q.options && (
                                <ul className="question-options">
                                {q.options.map((opt, idx) => (
                                    <li key={idx} className="question-option">
                                    {opt}
                                    </li>
                                ))}
                                </ul>
                            )}

                            <div className="question-header">
                                <h4>Cevap: {q.correctanswer}</h4>
                            </div>
                        </li>
                    ))}
                </ul>

            )}

            {selectedTest === test.testid && view === 'submitters' && (
                <div className="submitters-section">
                <ul className="submitter-list">
                    {submitters.slice(0, visibleCountLeaderboard).map(s => (
                   <li
                    key={s.submissionid}
                    onClick={() => handleViewAnswers(s.submissionid)}
                    className="submitter-card"
                    >
                        <div><strong>İsim:</strong> {s.submittername}</div>
                        <div><strong>Tarih:</strong> {new Date(s.submittedat).toLocaleString()}</div>
                        <div><strong>Doğru Sayısı:</strong> {s.correct_count}</div>
                    </li>
                    ))}
                </ul>
                {visibleCountLeaderboard < submitters.length && (
                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                        <button
                            onClick={() => setVisibleCountLeaderboard(visibleCountLeaderboard + 10)}
                            style={{
                            padding: '0.6rem 1.2rem',
                            backgroundColor: '#03022c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            }}
                        >
                            Daha Fazlası
                        </button>
                    </div>
                )}

                {selectedSubmission && (
                    <div className="answers-section">
                        <h4>Cevaplar</h4>
                        <ul className="answer-list">
                            {answers.map((a, i) => (
                            <li key={i}>
                                <strong>{a.questiontext}</strong>
                                <span>{a.answertext}</span>
                            </li>
                            ))}
                        </ul>
                    </div>
                )}
                </div>
            )}
            </div>
        ))}
        </div>

  );
};

export default UserTests;
