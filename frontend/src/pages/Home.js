import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const images = [
  'https://i.pinimg.com/736x/bc/ef/b1/bcefb146690d5848b8a83244a1e1e93a.jpg', 
  '/images/test2.jpg',
];

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
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Tüm Testler</h1>
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
              <img 
                src={test.image} 
                alt="test görseli"
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{test.title}</h3>
                <p style={{ color: '#666', margin: 0 }}>{test.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
