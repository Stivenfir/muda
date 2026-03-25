import { Link } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import PageCard from '../../components/common/PageCard';
import { useAppInfo } from '../../hooks/useAppInfo';
import { useHealth } from '../../hooks/useHealth';
import { getToken } from '../../utils/storage';

function DashboardPage() {
  const {
    data: health,
    loading: healthLoading,
    error: healthError,
  } = useHealth();

  const {
    data: appInfo,
    loading: appInfoLoading,
    error: appInfoError,
  } = useAppInfo();

  const hasToken = !!getToken();

  return (
    <div style={{ padding: '24px' }}>
      <h1>ABC Mudanzas</h1>
      <p>Frontend base conectado al backend NestJS</p>

      <div style={{ marginBottom: '16px' }}>
        <Link to="/login" style={{ marginRight: '12px' }}>
          Ir a Login
        </Link>
        <Link to="/profile">Ir a Profile</Link>
      </div>

      <PageCard title="Health del backend">
        {healthLoading && <Loading />}
        {healthError && <p>{healthError}</p>}
        {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
      </PageCard>

      <PageCard title="Información de la API">
        {appInfoLoading && <Loading />}
        {appInfoError && <p>{appInfoError}</p>}
        {appInfo && <pre>{JSON.stringify(appInfo, null, 2)}</pre>}
      </PageCard>

      <PageCard title="Estado local">
        <pre>
          {JSON.stringify(
            {
              hasToken,
            },
            null,
            2,
          )}
        </pre>
      </PageCard>
    </div>
  );
}

export default DashboardPage;