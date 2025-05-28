import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input placeholder="Name" onChange={e => setForm({...form, username: e.target.value})} />
      <input type="password" placeholder="Şifre" onChange={e => setForm({...form, password: e.target.value})} />
      <button type="submit">Giriş Yap</button>
    </form>
  );
}
