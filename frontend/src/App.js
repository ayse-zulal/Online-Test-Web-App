import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useEffect } from 'react'; 
import HomePage from './pages/Home';
import TestPage from './pages/TestPage';
import UserPage from './pages/UserPage';
import Register from './pages/RegisterPage';
import Login from './pages/LoginPage';
import Header from './components/Header';
import { useUserStore } from './stores/UserStore.ts';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  const { user, fetchUser } = useUserStore();
  useEffect(() => {
      if (!user) {
        fetchUser();
      }
    }, [user, fetchUser]);
  return (
    <Router>
      <Header isLoggedIn={!!user} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test/:id" element={<TestPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/to-register" element={<Register />} />
        <Route path="/to-login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
