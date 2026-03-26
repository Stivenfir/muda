import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123*');

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

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
    <div className="login-experience">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <div className={`login-modal ${isOpen ? 'is-open' : ''}`}>
        <section className="modal-left">
          <div className="login-badge">Sistema ABC Mudanzas</div>
          <h1>Movilidad internacional con control total</h1>
          <p className="subtitle">
            Plataforma empresarial para operaciones de mudanza internacional con trazabilidad, control
            documental y alertas inteligentes.
          </p>

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

        <section className="modal-right">
          <div className="route-grid" aria-hidden>
            <span className="dot d1" />
            <span className="dot d2" />
            <span className="dot d3" />
            <span className="dot d4" />
            <span className="line l1" />
            <span className="line l2" />
            <span className="line l3" />
          </div>

          <div className="transport-panel">
            <h3>Centro de control logístico</h3>
            <ul>
              <li>Seguimiento en tiempo real</li>
              <li>Control documental</li>
              <li>Alertas inteligentes</li>
            </ul>
          </div>

          <div className="icon-strip" aria-hidden>
            <span>🚢</span>
            <span>🚛</span>
            <span>📦</span>
            <span>🧭</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
