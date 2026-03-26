import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123*');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await login({
      username,
      password,
    });

    if (result) {
      navigate('/profile');
    }
  };

  return (
    <div className="login-shell">
      <div className="login-gradient login-gradient-1" />
      <div className="login-gradient login-gradient-2" />
      <div className="login-particles" />

      <section className="login-hero">
        <div className="network-overlay" aria-hidden>
          <span className="network-line line-a" />
          <span className="network-line line-b" />
          <span className="network-line line-c" />
          <span className="network-node node-a" />
          <span className="network-node node-b" />
          <span className="network-node node-c" />
        </div>

        <div className="transport-icons" aria-hidden>
          <span>🚢</span>
          <span>🚛</span>
          <span>📦</span>
          <span>🧭</span>
        </div>

        <div className="login-badge">Sistema ABC Mudanzas</div>
        <h1>Movilidad internacional con control total</h1>
        <p>
          Plataforma corporativa para trazabilidad E2E, alertas operativas y visibilidad gerencial en
          tiempo real.
        </p>
        <ul>
          <li>
            <span className="benefit-icon">✓</span> Seguimiento en tiempo real
          </li>
          <li>
            <span className="benefit-icon">✓</span> Control documental
          </li>
          <li>
            <span className="benefit-icon">✓</span> Alertas inteligentes
          </li>
        </ul>
      </section>

      <section className="login-card">
        <h2>Bienvenido</h2>
        <p>Inicia sesión para continuar.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className={loading ? 'is-loading' : ''}>
            {loading ? (
              <span className="loading-content">
                <span className="spinner" />
                Validando acceso...
              </span>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}
      </section>
    </div>
  );
}

export default LoginPage;
