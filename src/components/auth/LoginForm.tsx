import React, { useState } from 'react';
import { loginWithCredentials } from '../../services/auth';

interface LoginFormProps {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ supabaseUrl, supabaseAnonKey }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginWithCredentials(email, password, supabaseUrl, supabaseAnonKey);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Error durante el inicio de sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">

      {/* Header: logo + título */}
      <div className="login-card-header">
        <div className="login-logo">POS</div>
        <div>
          <h1 className="login-title">Terminal POS</h1>
          <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="login-error-banner">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Formulario */}
      <form className="login-form" onSubmit={handleLogin}>
        <div className="field-group">
          <label className="login-field-label" htmlFor="login-email">
            Correo Electrónico
          </label>
          <input
            id="login-email"
            type="email"
            className="login-field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@dominio.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="field-group">
          <label className="login-field-label" htmlFor="login-password">
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            className="login-field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary login-submit-btn"
          disabled={loading}
        >
          {loading ? 'Verificando...' : '🔓 Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};
