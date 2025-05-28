import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
export default function Home() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tests');
        setTests(res.data);
      } catch (error) {
        console.error('Testler alınamadı:', error);
      }
    };

    fetchTests();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>📘 Tüm Testler</h1>
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
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '10px',
              backgroundColor: '#fdfdfd',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease-in-out'
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h3>{test.title}</h3>
              <p style={{ color: '#666' }}>{test.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
