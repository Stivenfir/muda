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
                  <span aria-hidden>{showPassword ? '🙈' : '👁'}</span>
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
            <span className="dot d1" />
            <span className="dot d2" />
            <span className="dot d3" />
            <span className="dot d4" />
            <span className="line l1" />
            <span className="line l2" />
            <span className="line l3" />
          </div>
        </section>
      </div>

      <p className="version-text">ABC Mudanzas v1</p>
    </div>
  );
}

export default LoginPage;
