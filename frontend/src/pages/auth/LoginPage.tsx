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

      <section className="login-hero">
        <div className="login-badge">Sistema ABC Mudanzas</div>
        <h1>Movilidad internacional con control total</h1>
        <p>
          Plataforma corporativa para trazabilidad E2E, alertas operativas y visibilidad gerencial en
          tiempo real.
        </p>
        <ul>
          <li>✔ Seguimiento de operación por hitos</li>
          <li>✔ Control documental y evidencias</li>
          <li>✔ Alertas, incidencias y auditoría integrada</li>
        </ul>
      </section>

      <section className="login-card">
        <h2>Bienvenido</h2>
        <p>Inicia sesión para continuar.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu usuario"
            autoComplete="username"
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
          />

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
