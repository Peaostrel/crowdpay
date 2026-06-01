import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { markJustRegistered } from '../lib/onboarding';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) { return (e) => setForm((f) => ({ ...f, [field]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token, user } = await api.register(form);
      login(user, token);
      markJustRegistered();
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ paddingTop: '4rem', maxWidth: '400px' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create account</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        A Stellar wallet is created for you automatically.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div className="form-stack">
          <label className="label-strong" htmlFor="reg-name">Full name</label>
          <input id="reg-name" placeholder="Jane Doe" value={form.name} onChange={set('name')} required aria-required="true" autoComplete="name" />
        </div>
        <div className="form-stack">
          <label className="label-strong" htmlFor="reg-email">Email</label>
          <input id="reg-email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required aria-required="true" autoComplete="email" />
        </div>
        <div className="form-stack">
          <label className="label-strong" htmlFor="reg-password">Password</label>
          <input id="reg-password" type="password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} required aria-required="true" minLength={8} autoComplete="new-password" />
        </div>
        {error && <p role="alert" className="alert alert--error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.8rem' }}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p style={{ marginTop: '1.25rem', color: '#666', fontSize: '0.9rem' }}>
        Have an account? <Link to="/login" style={{ color: '#7c3aed', fontWeight: 600 }}>Log in</Link>
      </p>
    </main>
  );
}
