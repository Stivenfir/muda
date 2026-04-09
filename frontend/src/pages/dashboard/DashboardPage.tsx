import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getComercialDashboard } from '../../services/mudanzasDashboardService';
import type { ComercialDashboardResponse } from '../../types/mudanzasDashboard.types';
import './DashboardPage.css';

type QuickAction = {
  label: string;
};

const quickActions: QuickAction[] = [
  { label: 'Registrar Nueva Operación' },
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

const toDisplayName = (raw?: string) => {
  if (!raw) {
    return 'Usuario';
  }

  return raw
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

const toInitials = (name: string) => {
  const parts = name.split(' ').filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState<ComercialDashboardResponse | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const displayName = useMemo(() => toDisplayName(user?.username), [user?.username]);
  const initials = useMemo(() => toInitials(displayName), [displayName]);
  const primaryRole = useMemo(
    () => toDisplayName(user?.role || user?.roles?.[0] || 'Administrador'),
    [user?.role, user?.roles],
  );
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

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoadingDashboard(true);
        setDashboardError(null);
        const response = await getComercialDashboard();
        setDashboard(response);
      } catch (error) {
        console.error(error);
        setDashboardError('No fue posible cargar el flujo comercial en este momento.');
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const summaryCards = [
    {
      label: 'Leads nuevos',
      value: String(dashboard?.summary.leadsNuevos ?? 0),
    },
    {
      label: 'Cotizaciones enviadas',
      value: String(dashboard?.summary.cotizacionesEnviadas ?? 0),
    },
    {
      label: 'Operaciones ganadas',
      value: String(dashboard?.summary.operacionesGanadas ?? 0),
    },
    {
      label: 'Valor pipeline',
      value: formatCurrency(dashboard?.summary.valorPipeline ?? 0),
    },
  ];

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
                <button
                  key={item}
                  className={item === 'Flujo Comercial' ? 'is-active' : ''}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </section>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="avatar-shell">
            <div className="avatar-ring">
              <div className="avatar">{initials}</div>
            </div>
          </div>
          <div className="profile-copy">
            <strong>¡Hola {displayName}!</strong>
            <small>{primaryRole}</small>
            <span>Sin mensajes pendientes</span>
          </div>
        </div>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-topbar">
          <div>
            <h1>Mi Escritorio Comercial</h1>
            <p>Centro de control del ejecutivo comercial · {weekday}</p>
          </div>

          <div className="topbar-actions">
            {quickActions.map((action) => (
              <button key={action.label} type="button" className="primary-action">
                {action.label}
              </button>
            ))}
            <button type="button" className="role-chip">
              {primaryRole}
            </button>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </header>

        {loadingDashboard && <section className="card-block">Cargando flujo comercial...</section>}
        {dashboardError && <section className="card-block error-box">{dashboardError}</section>}

        {!loadingDashboard && !dashboardError && dashboard && (
          <>
            <section className="segment-strip">
              <span>🌐 Agentes {dashboard.quotationPending.length}</span>
              <span>🏢 Corporativo 2</span>
              <span>👤 Persona Natural 1</span>
            </section>

            <section className="focus-banner">
              <strong>Negocio del Agente</strong>
              <small>Requerimientos de agentes internacionales</small>
            </section>

            <section className="metrics-grid">
              {summaryCards.map((metric) => (
                <article key={metric.label} className="metric-card">
                  <strong>{metric.value}</strong>
                  <p>{metric.label}</p>
                </article>
              ))}
            </section>

            <section className="card-block">
              <div className="section-title">
                <h2>Mis Tareas Pendientes</h2>
                <span>{dashboard.pendingTasks.length}</span>
              </div>

              <div className="task-grid">
                {dashboard.pendingTasks.map((task) => (
                  <article key={task.id} className={task.source === 'clientify' ? 'task-card is-live' : 'task-card'}>
                    <div className="task-top">
                      <strong>{task.title}</strong>
                      <small>{task.dueInDays}d</small>
                    </div>
                    <p>{task.subtitle}</p>
                    <button type="button">{task.actionLabel}</button>
                  </article>
                ))}
              </div>
            </section>

            <section className="card-block table-block">
              <div className="section-title">
                <h2>Mis Operaciones</h2>
                <span>{dashboard.operations.length}</span>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Origen → Destino</th>
                    <th>Etapa actual</th>
                    <th>Docs</th>
                    <th>Próxima acción</th>
                    <th>Días</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.operations.map((row) => (
                    <tr key={row.code}>
                      <td>{row.code}</td>
                      <td>{row.client}</td>
                      <td>{row.type}</td>
                      <td>{row.route}</td>
                      <td>
                        <span className="phase-chip">{row.stage}</span>
                      </td>
                      <td>{row.docsProgress}</td>
                      <td>{row.nextAction}</td>
                      <td>{row.daysInStage}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <footer className="dashboard-footer">
              Fuente: {dashboard.meta.source} · Cache: {dashboard.meta.cached ? 'Sí' : 'No'} · Generado:{' '}
              {new Date(dashboard.meta.generatedAt).toLocaleString('es-CO')}
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
