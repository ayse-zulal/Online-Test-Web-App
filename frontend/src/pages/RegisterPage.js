import { useState } from 'react';
import axios from 'axios';
import './Register.css'; // CSS'yi ayrı dosyaya almak istersen

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Kayıt başarılı!");
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert("Kayıt başarısız: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Kayıt Ol</h2>
        <input
          className="register-input"
          placeholder="Ad"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          className="register-input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="register-input"
          type="password"
          placeholder="Şifre"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" className="register-button">Kayıt Ol</button>
      </form>
    </div>
  );
}
