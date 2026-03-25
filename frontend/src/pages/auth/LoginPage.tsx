import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageCard from '../../components/common/PageCard';
import { useAuth } from '../../hooks/useAuth';

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
    <div style={{ padding: '24px', maxWidth: '500px' }}>
      <PageCard title="Login">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label>Usuario</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginTop: '6px',
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginTop: '6px',
              }}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
      </PageCard>
    </div>
  );
}

export default LoginPage;