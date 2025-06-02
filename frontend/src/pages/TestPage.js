import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './TestPage.css'; 
import Loader from '../components/Loader';
import ErrorPage from '../components/ErrorPage'
import { toast } from 'react-toastify';

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
  const [visibleCountLeaderboard, setVisibleCountLeaderboard] = useState(10);
  const localKey = `test_taken_${id}`;


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`http://localhost:5000/api/tests/${id}`);
        setTest(res.data.test);
        setQuestions(res.data.questions);
        setAnswers(res.data.questions.map(q => ({ questionId: q.questionid, answerText: '' })));
        setCreator(res.data.creator);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
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
    setLoading(true);
    await axios.post('http://localhost:5000/api/submissions/create', {
      testId: id,
      submittername: participantName,
      answers,
    });
    localStorage.setItem(localKey, 'true');
    setLoading(false);
    toast.success('Cevaplarınız başarıyla gönderildi!');
    setShowModal(false);
    setAlreadySubmitted(true);
    await fetchLeaderboard();
  } catch (err) {
    console.error(err);
    toast.error('Bir hata oluştu.');
  }
};


  useEffect(() => {
    const taken = localStorage.getItem(localKey);
    if (taken) {
      setAlreadySubmitted(true);
    }
    fetchLeaderboard();
  }, [id, localKey]);

  const fetchLeaderboard = async () => {
    const res = await axios.get(`http://localhost:5000/api/submissions/leaderboard/${id}`);
    setLeaderboard(res.data);
  };

  const handleStartTest = () => {
    localStorage.setItem(localKey, 'true');
    setShowModal(true);
  };

  if (loading) return <Loader />;

  if (error) return (
    <ErrorPage/>
  );

  return (
    <div className={showModal ? 'blurred' : ''} style={{ padding: 30 }}>
      <div className="test-detail-container">
        <div className="test-header">
          <img src={test.image} alt="Test Görseli" className="test-image" />
          <div className="test-info">
            <h2 className="test-title">{test.title}</h2>
            <p><b>Açıklama:</b> {test.description}</p>
            <p><b>Soru Sayısı:</b> {questions.length}</p>
            <p><b>Hazırlayan:</b> {creator?.username || 'Bilinmiyor'}</p>
          </div>
        </div>
      </div>

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
            {leaderboard.slice(0, visibleCountLeaderboard).map((s, i) => {
              const rowClass =
                i === 0 ? 'gold-row' :
                i === 1 ? 'silver-row' :
                i === 2 ? 'bronze-row' : '';

              return (
                <tr key={s.submissionid} className={rowClass}>
                  <td>#{i + 1}</td>
                  <td>{s.submittername}</td>
                  <td>{s.correct_count ?? '—'}</td>
                  <td>{new Date(s.submittedat).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visibleCountLeaderboard < leaderboard.length && (
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
      </div>

      {alreadySubmitted ? (
        <div style={{ marginTop: 30 }}>
          <p style={{ color: 'white', backgroundColor: "#03022c", padding: "10px", borderRadius: 10 }}>
            Araya kaynak yapmak kötüdür, bunu daha önce zaten çözmüşsün?
          </p>

          <div className="answer-key">
            <h3 style={{ marginTop: 20, color: 'white' }}>Cevap Anahtarı</h3>
            {questions.map((q, index) => (
              <div key={q.questionid} className="question-card" style={{ marginBottom: 20, backgroundColor: '#03022c', padding: 15, borderRadius: 10 }}>
                <p style={{ color: 'white' }}>
                  <b>{index + 1}. {q.questiontext}</b>
                </p>
                {q.correctanswer ? (
                  <p style={{ color: '#a0ffb3', marginTop: 5 }}>✔ Doğru Cevap: {q.correctanswer}</p>
                ) : (
                  <p style={{ color: '#ffc0cb', marginTop: 5 }}>✖ Bu soru için tanımlı bir doğru cevap bulunamadı.</p>
                )}
              </div>
            ))}
          </div>
        </div>
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
