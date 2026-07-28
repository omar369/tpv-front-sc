import React, { useState } from 'react';
import { supabase, HARDCODED_ADMIN_EMAIL, HARDCODED_ADMIN_PASSWORD, loginAdminDefault } from '../../lib/supabase';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState(HARDCODED_ADMIN_EMAIL);
  const [password, setPassword] = useState(HARDCODED_ADMIN_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (email === HARDCODED_ADMIN_EMAIL && password === HARDCODED_ADMIN_PASSWORD) {
        await loginAdminDefault();
        window.location.href = '/';
        return;
      }

      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (authErr) {
        setError(authErr.message || 'Credenciales de acceso incorrectas');
        setLoading(false);
        return;
      }

      if (data.session) {
        localStorage.setItem('pos_token', data.session.access_token);
        localStorage.setItem('pos_user', JSON.stringify(data.user));
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'Error durante el inicio de sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail(HARDCODED_ADMIN_EMAIL);
    setPassword(HARDCODED_ADMIN_PASSWORD);
    setLoading(true);
    setError(null);
    await loginAdminDefault();
    window.location.href = '/';
  };

  return (
    <div style={{
      maxWidth: '420px',
      margin: '4rem auto',
      padding: '2.5rem',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '54px',
          height: '54px',
          margin: '0 auto 1rem',
          background: 'linear-gradient(135deg, var(--accent-color), #818cf8)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: '700',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
        }}>
          POS
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>Terminal POS</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          color: '#fca5a5',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="field-group">
          <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
            Correo Electrónico
          </label>
          <input
            type="email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@dominio.com"
            required
          />
        </div>

        <div className="field-group">
          <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
            Contraseña
          </label>
          <input
            type="password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem' }}
          disabled={loading}
        >
          {loading ? 'Verificando...' : '🔓 Iniciar Sesión'}
        </button>

        <button
          type="button"
          onClick={handleQuickAdminLogin}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.85rem' }}
          disabled={loading}
        >
          ⚡ Acceso Rápido Administrador
        </button>
      </form>

      <div style={{
        marginTop: '2rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        Credenciales Admin preconfiguradas:<br />
        <code style={{ color: 'var(--accent-color)', fontWeight: '600' }}>admin@pos.com</code> / <code style={{ color: 'var(--accent-color)', fontWeight: '600' }}>adminpassword123</code>
      </div>
    </div>
  );
};
