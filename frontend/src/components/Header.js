import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/UserStore.ts';
import './Header.css'; 
export default function ResponsiveHeader({ }) {
  const [menuOpen, setMenuOpen] = useState(false);
    const { user, fetchUser } = useUserStore();
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">TestApp</Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(prev => !prev)}>
          ☰
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <Link to="/user" onClick={() => setMenuOpen(false)}>Kullanıcı Sayfası</Link>
          ) : (
            <Link to="/" onClick={() => setMenuOpen(false)}>Testler</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
