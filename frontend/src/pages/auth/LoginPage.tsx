import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showPassword, setShowPassword] = useState(false);

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
    <div className={`login-experience theme-${theme}`}>
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="bg-flow" />

      <div className={`login-modal ${isOpen ? 'is-open' : ''}`}>
        <section className="modal-left">
          <div className="login-badge">Sistema ABC Mudanzas</div>
          <h1>Operación, trazabilidad y control en una sola plataforma</h1>
          <p className="subtitle">Accede al tablero operativo de ABC Mudanzas.</p>

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
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path
                        d="M3 3l18 18M10.6 10.6a2 2 0 102.8 2.8M9.5 4.8A10.5 10.5 0 0112 4c5.6 0 9.2 4.4 10 8a11 11 0 01-2.8 4.3M6.5 7.1A11.2 11.2 0 002 12c.8 3.6 4.4 8 10 8a10.4 10.4 0 004.1-.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path
                        d="M2 12s3.6-8 10-8 10 8 10 8-3.6 8-10 8S2 12 2 12zm10 4a4 4 0 100-8 4 4 0 000 8z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
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
          <div className="theme-toggle-wrap">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              aria-label="Cambiar tema"
            >
              <span className={theme === 'light' ? 'active' : ''}>Claro</span>
              <span className={theme === 'dark' ? 'active' : ''}>Oscuro</span>
            </button>
          </div>

          <div className="route-grid" aria-hidden>
            <header className="ops-header">
              <p>Ventajas del sistema ABC Mudanzas</p>
              <strong>Plataforma integral para gestionar todo el proceso</strong>
              <div className="ops-pill-row">
                <span>Gestión centralizada</span>
                <span>Visibilidad en tiempo real</span>
                <span>Ahorro de tiempo y recursos</span>
              </div>
            </header>

            <div className="route-column">
              <div className="route-line">
                <span className="route-progress" />
                <span className="route-marker" />
              </div>

              <div className="route-step is-complete">
                <div className="step-meta">
                  <strong>Inventario y embalaje</strong>
                  <span>Hoy · 08:10</span>
                </div>
                <small className="status-chip status-ok">Completado</small>
              </div>

              <div className="route-step is-active">
                <div className="step-meta">
                  <strong>Despacho internacional</strong>
                  <span>ETA puerto · 6h</span>
                </div>
                <small className="status-chip status-live">En tránsito</small>
              </div>

              <div className="route-step">
                <div className="step-meta">
                  <strong>Aduana y entrega final</strong>
                  <span>Programado · 29 Mar</span>
                </div>
                <small className="status-chip">Pendiente</small>
              </div>
            </div>

            <div className="kpi-row">
              <div className="kpi-box">
                <span>Automatización del sistema</span>
                <strong>10 hitos ejecutados sin fricción</strong>
              </div>
              <div className="kpi-box">
                <span>Último evento validado</span>
                <strong>Control documental completado</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      <p className="version-text">ABC Mudanzas v1</p>
    </div>
  );
}

export default LoginPage;
