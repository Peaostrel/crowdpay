import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoadingBalance(true);
    api.getMyBalance()
      .then(({ balance }) => setBalance(balance))
      .catch(() => {})
      .finally(() => setLoadingBalance(false));
  }, [user]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav style={styles.nav}>
      <div className="container nav-inner-wrap">
        <Link to="/" style={styles.logo}>CrowdPay</Link>
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <div className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}>
          {user ? (
            <>
              {(user.role === 'creator' || user.role === 'admin') && (
                <Link to="/campaigns/new" style={styles.link} onClick={closeMenu}>Start Campaign</Link>
              )}
              <Link to="/dashboard" style={styles.link} onClick={closeMenu}>Dashboard</Link>
              <Link to="/my-contributions" style={styles.link} onClick={closeMenu}>My Contributions</Link>
              {user.role === 'admin' && <Link to="/admin" style={styles.link} onClick={closeMenu}>Admin</Link>}
              <Link to="/developer" style={styles.link} onClick={closeMenu}>Developer</Link>
              <span style={styles.name}>{user.name}</span>
              {loadingBalance ? (
                <span style={styles.balanceLoading}>Loading…</span>
              ) : balance ? (
                <span style={styles.balance}>
                  {balance.USDC ? `${Number(balance.USDC).toFixed(2)} USDC` : ''}
                  {balance.USDC && balance.XLM ? ' · ' : ''}
                  {balance.XLM ? `${Number(balance.XLM).toFixed(2)} XLM` : ''}
                </span>
              ) : null}
              <button
                onClick={toggleTheme}
                style={styles.themeToggle}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={dark ? 'Light mode' : 'Dark mode'}
              >
                {dark ? '☀️' : '🌙'}
              </button>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 0.9rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link} onClick={closeMenu}>Log in</Link>
              <button
                onClick={toggleTheme}
                style={styles.themeToggle}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={dark ? 'Light mode' : 'Dark mode'}
              >
                {dark ? '☀️' : '🌙'}
              </button>
              <Link to="/register" onClick={closeMenu}>
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
  nav: { background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 10 },
  logo: { fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-accent)' },
  link: { color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '0.9rem' },
  name: { color: 'var(--color-text-secondary)', fontSize: '0.85rem', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  balance: { color: 'var(--color-text-hint)', fontSize: '0.8rem', fontFamily: 'monospace' },
  balanceLoading: { color: 'var(--color-text-muted)', fontSize: '0.8rem' },
  themeToggle: { background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: '6px', transition: 'background 0.15s' },
};
