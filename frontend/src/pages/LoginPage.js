import { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Aynı CSS dosyasını burada da kullanıyoruz
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      setLoading(false);
      localStorage.setItem("token", res.data.token);
      toast.success("Giriş başarılı!");
      navigate('/user'); 
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.error);
      toast.error("Giriş başarısız: " + (err.response?.data?.error || err.message));
    }
  };

  if(loading){
    <Loader/>
  }

  return (
    <div className="register-container">
      <form onSubmit={handleLogin} className="register-form">
        <h2>Giriş Yap</h2>
        <input
          className="register-input"
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
        <button type="submit" className="register-button">Giriş Yap</button>
      </form>
    </div>
  );
}
