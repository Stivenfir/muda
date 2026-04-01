import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeRefreshToken, removeToken } from '../../utils/storage';
import './DashboardPage.css';

type Metric = {
  label: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
};

type QuickAction = {
  label: string;
};

type AlertItem = {
  text: string;
  count?: number;
};

type OperationRow = {
  code: string;
  client: string;
  route: string;
  phase: string;
  health: 'ok' | 'warning';
  daysInPhase: string;
  updatedAt: string;
};

const metrics: Metric[] = [
  { label: 'Operaciones Activas', value: '5', trend: '+12% vs mes anterior', trendType: 'up' },
  { label: 'Pipeline Total', value: '$94.5K', trend: '+8% vs mes anterior', trendType: 'up' },
  { label: 'Tasa de Conversión', value: '18%', trend: '+5% vs mes anterior', trendType: 'up' },
  { label: 'Cotizaciones Pendientes', value: '3', trend: '-2% vs mes anterior', trendType: 'down' },
];

const quickActions: QuickAction[] = [
  { label: 'Nuevo Lead' },
  { label: 'Nuevo Costeo' },
  { label: 'Nuevo Estimado' },
  { label: 'Nueva Operación' },
];

const alerts: AlertItem[] = [
  { text: '1 incidencia(s) abiertas' },
  { text: 'Aprobaciones Pendientes', count: 2 },
  { text: 'Cotizaciones Vencidas' },
];

const operations: OperationRow[] = [
  {
    code: 'ABC-EXP-2026-001',
    client: 'Juan Pérez',
    route: 'Bogotá → Miami, FL',
    phase: 'expo_destino_agente',
    health: 'ok',
    daysInPhase: '0d',
    updatedAt: 'hoy',
  },
  {
    code: 'ABC-EXP-2026-002',
    client: 'Sarah Johnson',
    route: 'Lima → Houston, TX',
    phase: 'expo_transito',
    health: 'warning',
    daysInPhase: '6d',
    updatedAt: 'hace 2 días',
  },
];

const sidebarGroups = [
  {
    title: 'Principal',
    items: ['Dashboard'],
  },
  {
    title: 'Comercial',
    items: ['Flujo Comercial', 'Pipeline', 'Cotizaciones'],
  },
  {
    title: 'Operaciones',
    items: ['Operaciones', 'Estimados', 'Ops. de Campo', 'Calendario', 'Cuadrillas'],
  },
  {
    title: 'Agentes & Ferias',
    items: ['Agentes'],
  },
  {
    title: 'Calidad',
    items: ['Incidencias', 'Reclamaciones'],
  },
];

function DashboardPage() {
  const navigate = useNavigate();
  const weekday = useMemo(
    () =>
      new Date().toLocaleDateString('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [],
  );

  const handleLogout = () => {
    removeToken();
    removeRefreshToken();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <aside className="dashboard-sidebar">
        <div className="brand-box">
          <div className="brand-mark">↗</div>
          <div>
            <strong>ABC Moving</strong>
            <small>Relocation</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarGroups.map((group) => (
            <section key={group.title}>
              <p>{group.title}</p>
              {group.items.map((item) => (
                <button key={item} className={item === 'Dashboard' ? 'is-active' : ''} type="button">
                  {item}
                </button>
              ))}
            </section>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">CR</div>
          <div>
            <strong>Carlos Rodríguez</strong>
            <small>Director</small>
          </div>
        </div>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-topbar">
          <div>
            <h1>Buenas tardes, Carlos</h1>
            <p>{weekday}</p>
          </div>

          <div className="topbar-actions">
            {quickActions.map((action) => (
              <button key={action.label} type="button">
                {action.label}
              </button>
            ))}
            <button type="button" className="role-chip">
              Gerente
            </button>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </header>

        <section className="metrics-grid">
          {metrics.map((metric) => (
            <article key={metric.label} className="metric-card">
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <small className={metric.trendType === 'up' ? 'trend-up' : 'trend-down'}>
                {metric.trend}
              </small>
            </article>
          ))}
        </section>

        <section className="card-block">
          <h2>Alertas Accionables</h2>
          <div className="highlight-row">
            <span>{alerts[0].text}</span>
            <button type="button">Gestionar</button>
          </div>
        </section>

        <section className="card-block">
          <div className="alert-lines">
            {alerts.slice(1).map((alert) => (
              <p key={alert.text}>
                {alert.text}
                {alert.count ? <span>{alert.count}</span> : null}
              </p>
            ))}
          </div>

          <div className="list-items">
            <div>
              <span>Enviada: 25/3/2026</span>
              <em>Venció: 31/12/1969</em>
              <div className="item-actions">
                <button type="button">Renovar</button>
                <button type="button">Cerrar</button>
              </div>
            </div>
            <div>
              <span>Enviada: 26/3/2026</span>
              <em>Venció: 31/12/1969</em>
              <div className="item-actions">
                <button type="button">Renovar</button>
                <button type="button">Cerrar</button>
              </div>
            </div>
          </div>
        </section>

        <section className="card-block table-block">
          <div className="table-title">
            <h2>Mis Operaciones</h2>
            <button type="button">Ver todas</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Origen → Destino</th>
                <th>Fase</th>
                <th>Salud</th>
                <th>Días en fase</th>
                <th>Última actualización</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((row) => (
                <tr key={row.code}>
                  <td>{row.code}</td>
                  <td>{row.client}</td>
                  <td>{row.route}</td>
                  <td>
                    <span className="phase-chip">{row.phase}</span>
                  </td>
                  <td>
                    <span className={`health-dot ${row.health === 'ok' ? 'is-ok' : 'is-warning'}`} />
                  </td>
                  <td>{row.daysInPhase}</td>
                  <td>{row.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="dashboard-footer">ABC Mudanzas · Dashboard Administrador · Fase 1 Comercial</footer>
      </main>
    </div>
  );
}

export default DashboardPage;
