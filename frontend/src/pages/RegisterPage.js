import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleRegister = async (e) => {
    e.preventDefault(); // Formun sayfayı yeniden yüklemesini engeller
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Kayıt başarılı!");
      console.log("Sunucudan gelen cevap:", res.data);
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert("Kayıt başarısız: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        placeholder="Ad"
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        required
      />
      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Şifre"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
      />
      <button type="submit">Kayıt Ol</button>
    </form>
  );
}
