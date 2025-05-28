import { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Aynı CSS dosyasını burada da kullanıyoruz

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Giriş başarılı!");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.error);
      alert("Giriş başarısız: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleLogin} className="register-form">
        <h2>Giriş Yap</h2>
        <input
          className="register-input"
          placeholder="Ad"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
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
        <button type="submit" className="register-button">Giriş Yap</button>
      </form>
    </div>
  );
}
