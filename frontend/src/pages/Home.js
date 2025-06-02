import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import ErrorPage from '../components/ErrorPage'
export default function Home() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(true);

  useEffect(() => {
  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/tests');
      setTests(res.data);
    } catch (error) {
      console.error('Testler alınamadı:', error);
      setLoading(false);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  fetchTests();
  
}, []);

if (loading) {
  return <Loader />;
}
if (error) {
  return <ErrorPage />;
}

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      {!showRulesModal && (
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          margin: '20px auto',
          maxWidth: '1000px',
        }}>
          <h3 style={{ marginTop: 0, textAlign: 'center'}}>Kurallar</h3>
          <ul style={{ margin: 0 }}>
            <li style={{marginBottom:5}}>Her teste sadece <strong>bir</strong> kere katılabilirsiniz, hile yok</li>
            <li style={{marginBottom:5}}>Tüm sorular <strong>zorunlu</strong>, boş bırakılamaz, testi tamamladıktan sonra <strong>cevap anahtarını</strong> ve sıralamadaki yerinizi görebilirsiniz</li>
          </ul>
        </div>
      )}
      <h1 style={{ textAlign: 'center', color:"white", marginBottom: '30px' }}>Testler</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {tests.map((test) => (
          <Link 
            to={`/test/${test.testid}`} 
            key={test.testid} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              padding: '0',
              border: '1px solid #ddd',
              borderRadius: '10px',
              backgroundColor: '#fdfdfd',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease-in-out',
              overflow: 'hidden'
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {test.image && (
                <img 
                  src={test.image} 
                  alt="test görseli"
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
              )}
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{test.title}</h3>
                <p style={{ color: '#666', margin: 0 }}>{test.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {showRulesModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            textAlign: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          }}>
            <h2>Kurallar</h2>
            <ul style={{ margin: 0 }}>
            <li style={{marginBottom:5}}>Her teste sadece <strong>bir</strong> kere katılabilirsiniz, hile yok</li>
            <li style={{marginBottom:5}}>Tüm sorular zorunlu, boş bırakılamaz, testi tamamladıktan sonra cevap anahtarını ve sıralamadaki yerinizi görebilirsiniz</li>
          </ul>
            <button onClick={() => setShowRulesModal(false)} style={{
              padding: '10px 20px',
              backgroundColor: '#03022c',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>Tamam</button>
          </div>
        </div>
      )}
    </div>
  );
}
