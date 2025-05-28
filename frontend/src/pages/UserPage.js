import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserStore } from '../stores/UserStore.ts'; 
export default function UserPage() {
  const { user, isLoading, fetchUser } = useUserStore();
  const [testImage, setTestImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', questionType: 'open-ended', options: ['', '', '', ''], correctAnswer: '', image: '' }
  ]);
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  const handleImageUpload = async (file, qIndex) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'test-preset'); 
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dvv4yznic/image/upload', formData);
      const imageUrl = res.data.secure_url;
      setQuestions(qs =>
        qs.map((q, i) => i === qIndex ? { ...q, image: imageUrl } : q)
      );
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const handleTestImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'test-preset'); 
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dvv4yznic/image/upload', formData);
      setTestImage(res.data.secure_url);
    } catch (err) {
      console.error('Test görseli yüklenemedi:', err);
    }
  };


  const handleCreateTest = async () => {
    try {
      await axios.post('http://localhost:5000/api/tests/create', {
        title,
        description,
        userId: user.user.userid,
        image: testImage,
        questions,
      });
      alert('Test oluşturuldu!');
      setTitle('');
      setDescription('');
      setTestImage('');
      setQuestions([{ questionText: '', questionType: 'open-ended', options: ['', '', '', ''], correctAnswer: '', image: '' }]);
    } catch (err) {
      console.error(err);
      alert('Test oluşturulamadı.');
    }
  };
  const handleImageRemove = (index) => {
  setQuestions(prev => {
    const newQuestions = [...prev];
    newQuestions[index].image = null; 
    return newQuestions;
  });
};


  return (
    <div
  style={{
    padding: '30px 10px',
    maxWidth: 500,
    margin: 'auto',
    fontFamily: 'Georgia, serif',
    color: '#333'
  }}
>
  <h2 style={{ marginBottom: 20, fontSize: 28, textAlign: 'center' }}>Yeni Test Oluştur</h2>

  <div style={{ marginBottom: 20 }}>
    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Test Başlığı</label>
    <input
      placeholder="Test Başlığı"
      value={title}
      onChange={e => setTitle(e.target.value)}
      style={{
        width: '90%',
        padding: 10,
        borderRadius: 8,
        border: '1px solid #ccc',
      }}
    />
  </div>

  <div style={{ marginBottom: 30 }}>
    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Açıklama</label>
    <textarea
      placeholder="Açıklama"
      value={description}
      onChange={e => setDescription(e.target.value)}
      style={{
        width: '90%',
        padding: 10,
        borderRadius: 8,
        border: '1px solid #ccc',
        minHeight: 80,
        resize: 'vertical',
      }}
    />
  </div>

  <div style={{ marginBottom: 30 }}>
  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Test Görseli</label>
  <label htmlFor="test-image-upload" style={{
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: '#e27373',
    color: 'white',
    borderRadius: 4,
    cursor: 'pointer',
    fontWeight: 'bold'
  }}>
    Dosya Seç
  </label>
  <input
    id="test-image-upload"
    type="file"
    onChange={(e) => handleTestImageUpload(e.target.files[0])}
    style={{ display: 'none' }}
  />
  {testImage && (
    <div style={{ marginTop: 10 }}>
      <img src={testImage} alt="Test görseli" style={{ maxWidth: '100%', borderRadius: 8 }} />
    </div>
  )}
</div>

  {questions.map((q, index) => (
  <div
    key={index}
    style={{
      marginBottom: 30,
      padding: 20,
      width: "85%",
      borderRadius: 12,
      border: '1px solid #ddd',
      backgroundColor: '#fafafa',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      position: 'relative',
    }}
  >
    <button
      onClick={() => {
        const updated = [...questions];
        updated.splice(index, 1);
        setQuestions(updated);
      }}
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        border: 'none',
        backgroundColor: 'transparent',
        color: '#e27373',
        fontWeight: 'bold',
        fontSize: 18,
        cursor: 'pointer',
      }}
    >
      ✖
    </button>

    <h4 style={{ marginBottom: 15 }}>
      Soru {index + 1} ({q.questionType === 'multiple-choice' ? 'Çoktan Seçmeli' : 'Açık Uçlu'})
    </h4>

    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Soru Metni</label>
    <input
      value={q.questionText}
      onChange={e => {
        const updated = [...questions];
        updated[index].questionText = e.target.value;
        setQuestions(updated);
      }}
      style={{
        width: '100%',
        padding: 8,
        borderRadius: 6,
        border: '1px solid #ccc',
        marginBottom: 15,
      }}
    />

    {q.questionType === 'multiple-choice' && (
      <>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Seçenekler</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 15 }}>
          {q.options.map((opt, i) => (
            <input
              key={i}
              placeholder={`Seçenek ${i + 1}`}
              value={opt}
              onChange={e => {
                const updated = [...questions];
                updated[index].options[i] = e.target.value;
                setQuestions(updated);
              }}
              style={{
                flex: '1 1 45%',
                padding: 8,
                borderRadius: 6,
                border: '1px solid #ccc',
              }}
            />
          ))}
        </div>
      </>
    )}

    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Doğru Cevap</label>
    <input
      placeholder="Doğru Cevap"
      value={q.correctAnswer}
      onChange={e => {
        const updated = [...questions];
        updated[index].correctAnswer = e.target.value;
        setQuestions(updated);
      }}
      style={{
        width: '100%',
        padding: 8,
        borderRadius: 6,
        border: '1px solid #ccc',
        marginBottom: 15,
      }}
    />

    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Görsel</label>
    <div>
    <label htmlFor={`file-upload-${index}`} style={{
      display: 'inline-block',
      padding: '6px 12px',
      backgroundColor: '#e27373',
      color: 'white',
      borderRadius: 4,
      cursor: 'pointer',
      fontWeight: 'bold'
    }}>
      Dosya Seç
    </label>
    <input
      id={`file-upload-${index}`}
      type="file"
      onChange={e => handleImageUpload(e.target.files[0], index)}
      style={{ display: 'none' }} 
    />
    <button
      onClick={() => handleImageRemove(index)}
      style={{
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        marginLeft: "5px",
        width: 24,
        height: 24,
        cursor: 'pointer',
        fontWeight: 'bold',
        lineHeight: '20px',
      }}
      title="Görseli Sil"
    >
      ×
    </button>
  </div>
    {q.image && (
      <img
        src={q.image}
        alt="soru görseli"
        style={{ maxWidth: '100%', borderRadius: 8, marginTop: 10 }}
      />
    )}
  </div>
))}


  <div style={{ textAlign: 'center', marginTop: 20 }}>
    <div style={{ textAlign: 'center', marginTop: 20 }}>
  <p style={{ fontWeight: 'bold', marginBottom: 10 }}>Eklenecek Soru Tipi Seçin:</p>
  <button
    onClick={() =>
      setQuestions([
        ...questions,
        {
          questionText: '',
          questionType: 'multiple-choice',
          options: ['', '', '', ''],
          correctAnswer: '',
          image: '',
        },
      ])
    }
    style={{
      marginRight: 10,
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px solid #ccc',
      cursor: 'pointer',
      backgroundColor: '#f4b6b6',
    }}
  >
    Çoktan Seçmeli Soru
  </button>
  <button
    onClick={() =>
      setQuestions([
        ...questions,
        {
          questionText: '',
          questionType: 'open-ended',
          options: [],
          correctAnswer: '',
          image: '',
        },
      ])
    }
    style={{
      padding: '8px 12px',
      borderRadius: 6,
      marginTop: "5px",
      border: '1px solid #ccc',
      cursor: 'pointer',
      backgroundColor: '#f4b6b6',
    }}
  >
    Açık Uçlu Soru
  </button>
</div>
    <br />
    <button
      onClick={handleCreateTest}
      style={{
        backgroundColor: '#e27373',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: 8,
        fontSize: 16,
        cursor: 'pointer',
      }}
    >
      Testi Oluştur
    </button>
  </div>
</div>

  );
}
