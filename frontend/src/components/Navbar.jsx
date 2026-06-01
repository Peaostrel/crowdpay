import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav style={styles.nav}>
      <div className="container nav-inner-wrap">
        <Link to="/" style={styles.logo} aria-label="CrowdPay home" aria-current={pathname === '/' ? 'page' : undefined}>CrowdPay</Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/campaigns/new" style={styles.link} aria-current={pathname === '/campaigns/new' ? 'page' : undefined}>Start Campaign</Link>
              <span style={styles.name} aria-hidden="true">{user.name}</span>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 0.9rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link} aria-current={pathname === '/login' ? 'page' : undefined}>Log in</Link>
              <Link to="/register" aria-current={pathname === '/register' ? 'page' : undefined}>
                <button className="btn-primary" style={{ padding: '0.4rem 0.9rem' }}>Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: '#fff', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: 0, zIndex: 10 },
  logo: { fontWeight: 800, fontSize: '1.15rem', color: '#7c3aed' },
  link: { color: '#444', fontWeight: 500, fontSize: '0.9rem' },
  name: { color: '#555', fontSize: '0.85rem', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
};
