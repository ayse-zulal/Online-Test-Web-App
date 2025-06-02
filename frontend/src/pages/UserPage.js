import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserStore } from '../stores/UserStore.ts'; 
import { toast } from 'react-toastify';
import Loader from '../components/Loader.js';
import UserTests from '../components/UserTests.js';
export default function UserPage() {
  const { user, fetchUser } = useUserStore();
  const [testImage, setTestImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showRulesModal, setShowRulesModal] = useState(true);
  const [loading, setLoading] = useState(false);
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
    if (title.trim() === '' || description.trim() === '' || testImage.trim() === '') {
      toast.error('Lütfen test başlığı, açıklaması ve görselini doldurun.');
      return;
    }

    const hasInvalidQuestion = questions.some((q, idx) => {
      if (q.questionText.trim() === '' || q.correctAnswer.trim() === '') {
        toast.error(`Lütfen ${idx + 1}. sorunun metnini ve doğru cevabını doldurun.`);
        return true;
      }
      return false;
    });

    if (questions.length == 0) {
      toast.error('Lütfen testinize soru ekleyin');
      return;
    }

    if (hasInvalidQuestion) return;

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/tests/create', {
        title,
        description,
        userId: user.user.userid,
        image: testImage,
        questions,
      });
      setLoading(false);

      toast.success('Test başarıyla oluşturuldu!');
      setTitle('');
      setDescription('');
      setTestImage('');
      setQuestions([
        {
          questionText: '',
          questionType: 'open-ended',
          options: ['', '', '', ''],
          correctAnswer: '',
          image: '',
        },
      ]);
    } catch (err) {
      console.error(err);
      toast.error('Test oluşturulamadı.');
    }
  };

  const handleImageRemove = (index) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[index].image = null; 
      return newQuestions;
    });
  };

  if (!user) {
    return (
      <div className="unauth-container">
        <div className="unauth-box">
          <h2>Giriş Yapmalısın</h2>
          <p>Bu sayfayı görüntülemek için hesabına giriş yapman gerekiyor.</p>
          <a href="/to-login" className="unauth-button">Giriş Sayfasına Git</a>
        </div>
      </div>
    );
  }
  if(loading) {
    return <Loader/>
  }


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
            <li style={{marginBottom:5}}>İstediğin kadar test oluşturabilirsin</li>
              <li style={{marginBottom:5}}>Her testin sınırsız sayıda sorusu olabilir, <strong>açık uçlu</strong>, <strong>çoktan seçmeli</strong> arasında seçim yapabilir, soruları kafana göre ekleyip çıkartabilirsin</li>
              <li style={{marginBottom:5}}><strong>Üye olmak</strong> ve <strong>giriş yapmak</strong> için kullandığın linki saklamayı unutma ve kimseyle paylaşma, burası yazarlara özel!</li>
              <li style={{marginBottom:5}}>Bu arada günlük olarak yeniden <strong>login</strong> istiyor, güvenlik açısından bir önlem, login olduktan sonra <strong>header</strong> üzerindeki toggle barda testler yerine kullanıcı sayfası gözükecek oradan kullanıcı sayfana ulaşabilirsin, tüm testleri görmek istersen de <strong>logonun</strong> üzerine tıklayıp ana sayfaya gidebilirsin</li>
              <li style={{marginBottom:5}}>Siteyle ilgili şikayetin, tavsiyen falan olursa <strong>@mensisnigrum</strong> ismiyle beni herhangi bir platformda bulabilirsin zaten tanışıyoruzdur</li>
              <li style={{marginBottom:5}}>Test güncelleme ve silme fonksiyonlarını eklemedim(üşendim), öyle bir isteğin olursa da beni bul manuel silerim, güncellemeye hiç girmeyelim</li>
          </ul>
        </div>
      )}
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
    backgroundColor: '#03022c',
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
        color: '#03022c',
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
        width: '93%',
        padding: 8,
        borderRadius: 6,
        border: '1px solid #ccc',
        marginBottom: 15,
      }}
    />
    {q.questionType === "open-ended" &&(
      <>
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
              width: '93%',
              padding: 8,
              borderRadius: 6,
              border: '1px solid #ccc',
              marginBottom: 15,
            }}
          />
      </> )}

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
                const newValue = e.target.value.trim(); 
                const updated = [...questions];
                const currentOptions = updated[index].options;

                if (newValue !== "") {
                  const isDuplicate = currentOptions.some((opt, optIndex) => 
                    optIndex !== i && opt.trim() === newValue
                  );

                  if (isDuplicate) {
                    toast.error("Aynı seçenekten zaten var. Lütfen farklı bir değer girin.");
                    return;
                  }
                }

                updated[index].options[i] = e.target.value; 

                if (updated[index].correctAnswer === currentOptions[i] && newValue === "") {
                  updated[index].correctAnswer = "";
                }

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

        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Doğru Cevap</label>
        <select
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
        >
          <option value="">Şıklardan birini seçin</option>
          {q.options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt || `Seçenek ${i + 1}`}
            </option>
          ))}
        </select>
      </>
    )}

    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Görsel</label>
    <div>
    <label htmlFor={`file-upload-${index}`} style={{
      display: 'inline-block',
      padding: '6px 12px',
      backgroundColor: '#03022c',
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
  <p style={{ fontWeight: 'bold', marginBottom: 10 }}>Eklenecek Soru Tipi:</p>
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
      backgroundColor: '#c7c6f4',
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
      backgroundColor: '#c7c6f4',
    }}
  >
    Açık Uçlu Soru
  </button>
</div>
    <br />
    <button
      onClick={handleCreateTest}
      style={{
        backgroundColor: '#03022c',
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
            <ul style={{ margin: 0, textAlign:'left'}}>
            <li style={{marginBottom:5}}>İstediğin kadar test oluşturabilirsin</li>
              <li style={{marginBottom:5}}>Her testin sınırsız sayıda sorusu olabilir, <strong>açık uçlu</strong>, <strong>çoktan seçmeli</strong> arasında seçim yapabilir, soruları kafana göre ekleyip çıkartabilirsin</li>
              <li style={{marginBottom:5}}><strong>Üye olmak</strong> ve <strong>giriş yapmak</strong> için kullandığın linki saklamayı unutma ve kimseyle paylaşma, burası yazarlara özel!</li>
              <li style={{marginBottom:15}}>Siteyle ilgili şikayetin, tavsiyen falan olursa <strong>@mensisnigrum</strong> ismiyle beni herhangi bir platformda bulabilirsin zaten tanışıyoruzdur</li>
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
      <UserTests userid={user.user.userid} />
</div>

  );
}
