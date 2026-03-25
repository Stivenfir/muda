import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageCard from '../../components/common/PageCard';
import Loading from '../../components/common/Loading';
import { getProfile } from '../../services/authService';
import type { ProfileResponse } from '../../types/auth.types';
import { removeToken } from '../../utils/storage';

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
        removeToken();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <Loading />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Perfil protegido</h1>

      <div style={{ marginBottom: '16px' }}>
        <Link to="/" style={{ marginRight: '12px' }}>
          Dashboard
        </Link>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <PageCard title="Usuario autenticado">
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </PageCard>
    </div>
  );
}

export default ProfilePage;