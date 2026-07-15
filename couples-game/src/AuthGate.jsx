import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

// Gates the whole app behind a single shared login. Only someone who knows the
// shared account's email + password can reach the game, and the Firestore rules
// (../firestore.rules) enforce the same restriction on the data itself.
const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
};
const cardStyle = {
  width: '100%',
  maxWidth: '22rem',
  padding: '2rem',
  borderRadius: '0.5rem',
  background: 'linear-gradient(135deg, rgba(244, 168, 168, 0.2) 0%, rgba(232, 137, 154, 0.1) 100%)',
  border: '2px solid #f4a8a8',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};
const h2Style = { fontSize: '1.5rem', color: '#f4a8a8', fontFamily: 'Georgia, serif', textAlign: 'center' };
const subStyle = { color: '#d1d5db', fontSize: '0.875rem', textAlign: 'center', marginBottom: '0.5rem' };
const inputStyle = {
  width: '100%',
  padding: '0.85rem',
  borderRadius: '0.5rem',
  border: '2px solid #4a4a6a',
  background: 'rgba(42, 42, 62, 0.6)',
  color: '#fff',
  fontSize: '1rem'
};
const btnStyle = {
  width: '100%',
  padding: '0.9rem',
  borderRadius: '0.5rem',
  fontWeight: '600',
  fontSize: '1rem',
  color: '#1a1a2e',
  background: '#f4a8a8',
  border: 'none',
  cursor: 'pointer',
  marginTop: '0.5rem'
};
const errStyle = { color: '#ffb4b4', fontSize: '0.85rem', textAlign: 'center' };
const loadingStyle = { ...pageStyle, color: '#f4a8a8', fontFamily: 'Georgia, serif' };
const signoutStyle = {
  fontSize: '0.75rem',
  color: '#d1d5db',
  background: 'rgba(26,26,46,0.7)',
  border: '1px solid #4b5563',
  borderRadius: '0.375rem',
  padding: '0.35rem 0.6rem',
  cursor: 'pointer'
};

export default function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecked(true);
    });
    return () => unsub();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError('Wrong email or password.');
    } finally {
      setBusy(false);
    }
  };

  if (!checked) {
    return <div style={loadingStyle}>Loading…</div>;
  }

  if (!user) {
    return (
      <div style={pageStyle}>
        <form onSubmit={submit} style={cardStyle}>
          <h2 style={h2Style}>Private 🔒</h2>
          <p style={subStyle}>Sign in to continue.</p>
          <input
            style={inputStyle}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <p style={errStyle}>{error}</p>}
          <button style={btnStyle} type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ position: 'fixed', top: 8, right: 8, zIndex: 50 }}>
        <button onClick={() => signOut(auth)} style={signoutStyle}>Sign out</button>
      </div>
      {children}
    </div>
  );
}
