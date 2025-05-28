import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './TestPage.css'; 
export default function TestDetail() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [creator, setCreator] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [answers, setAnswers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const localKey = `test_taken_${id}`;


  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`http://localhost:5000/api/tests/${id}`).then(res => {
        setTest(res.data.test);
        setQuestions(res.data.questions);
        setAnswers(res.data.questions.map(q => ({ questionId: q.questionid, answerText: '' })));
        setCreator(res.data.creator);
      });
    };
    fetchData();
  }, [id]);

  const handleAnswerChange = (index, answer, questionId) => {
    const updated = [...answers];
    updated[index].answerText = answer;
    updated[index].questionId = questionId;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
  try {
    await axios.post('http://localhost:5000/api/submissions/create', {
      testId: id,
      submittername: participantName,
      answers,
    });
    localStorage.setItem(localKey, 'true');
    alert('Test başarıyla gönderildi!');
    setShowModal(false);
    setAlreadySubmitted(true);
  } catch (err) {
    console.error(err);
    alert('Bir hata oluştu.');
  }
};


  useEffect(() => {
  const fetchLeaderboard = async () => {
    const res = await axios.get(`http://localhost:5000/api/submissions/leaderboard/${id}`);
    setLeaderboard(res.data);
  };
  const taken = localStorage.getItem(localKey);
  if (taken) {
    setAlreadySubmitted(true);
  }
  fetchLeaderboard();
}, [id, localKey]);

const handleStartTest = () => {
  localStorage.setItem(localKey, 'true');
  setShowModal(true);
};
console.log(creator)

  if (!test) return <div>Yükleniyor...</div>;

  return (
    <div className={showModal ? 'blurred' : ''} style={{ padding: 30 }}>
      <h2>{test.title}</h2>
      <p><b>Açıklama:</b> {test.description}</p>
      <p><b>Soru Sayısı:</b> {questions.length}</p>
      <p><b>Hazırlayan:</b> {creator?.username || 'Bilinmiyor'}</p>

      <div className="leaderboard-container">
        <h3>Liderlik Tablosu</h3>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Sıra</th>
              <th>İsim</th>
              <th>Puan</th>
              <th>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.slice(0, 10).map((s, i) => (
              <tr key={s.submissionid}>
                <td>#{i + 1}</td>
                <td>{s.submittername}</td>
                <td>{s.correct_count ?? '—'}</td>
                <td>{new Date(s.submittedat).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {alreadySubmitted ? (
        <p style={{ color: 'red', marginTop: 20 }}>
          Bu testi zaten tamamladınız. Tekrar katılamazsınız.
        </p>
      ) : (
        <button onClick={handleStartTest} className="start-button">Teste Başla</button>
      )}


      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Teste Başla</h3>
            <input
              placeholder="İsminizi girin"
              value={participantName}
              onChange={e => setParticipantName(e.target.value)}
              className="input"
            />

            {questions.map((q, index) => (
              <div key={q.questionid} className="question-card">
                
                {q.image && (
                  <img
                    src={q.image}
                    alt={`Soru ${index + 1} görseli`}
                    className="question-image"
                  />
                )}

                <p className="question-text">
                  <b>{index + 1}. {q.questiontext}</b>
                </p>

                {q.questiontype === 'open-ended' ? (
                  <textarea
                    className="answer-textarea"
                    placeholder="Cevabınızı buraya yazınız..."
                    value={answers[index]?.answerText || ''}
                    onChange={e =>
                      handleAnswerChange(index, e.target.value, q.questionid)
                    }
                  />
                ) : (
                  q.options.map(opt => (
                    <label key={opt} className="option-label">
                      <input
                        type="radio"
                        name={`q-${q.questionid}`}
                        value={opt}
                        checked={answers[index]?.answerText === opt}
                        onChange={() =>
                          handleAnswerChange(index, opt, q.questionid)
                        }
                      />
                      {opt}
                    </label>
                  ))
                )}
              </div>
            ))}


            <button
              onClick={() => {
                const allAnswered = answers.every(a => a.answerText?.trim() !== '') && participantName?.trim() !== '';
                if (!allAnswered) {
                  setShowWarning(true);
                  return;
                }

                setShowWarning(false);
                handleSubmit();
                setShowModal(false);
              }}
              className="submit-button"
            >
              Testi Bitir
            </button>
            {showWarning && (
              <div className="overlay">
                <div className="warning-modal">
                  <p className="warning-text">Lütfen tüm soruları cevaplayınız.</p>
                  <button onClick={() => setShowWarning(false)} className="warning-button">
                    Tamam
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
