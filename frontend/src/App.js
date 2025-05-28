import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import TestPage from './pages/TestPage';
import UserPage from './pages/UserPage';
import Register from './pages/RegisterPage';
import Login from './pages/LoginPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test/:id" element={<TestPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
