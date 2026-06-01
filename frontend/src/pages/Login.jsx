import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) { return (e) => setForm((f) => ({ ...f, [field]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token, user } = await api.login(form);
      login(user, token);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ paddingTop: '4rem', maxWidth: '400px' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>Log in</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div className="form-stack">
          <label className="label-strong" htmlFor="login-email">Email</label>
          <input id="login-email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required aria-required="true" autoComplete="email" />
        </div>
        <div className="form-stack">
          <label className="label-strong" htmlFor="login-password">Password</label>
          <input id="login-password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required aria-required="true" autoComplete="current-password" />
        </div>
        {error && <p role="alert" className="alert alert--error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.8rem' }}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p style={{ marginTop: '1.25rem', color: '#666', fontSize: '0.9rem' }}>
        No account? <Link to="/register" style={{ color: '#7c3aed', fontWeight: 600 }}>Sign up</Link>
      </p>
    </main>
  );
}
