import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminShell.css';

type QuickAction = {
  label: string;
};

type AdminShellProps = {
  title: string;
  subtitle: string;
  activeItem: 'Dashboard' | 'Flujo Comercial';
  quickActions?: QuickAction[];
  children: React.ReactNode;
};

const sidebarGroups = [
  { title: 'Principal', items: ['Dashboard'] },
  { title: 'Comercial', items: ['Flujo Comercial', 'Pipeline', 'Cotizaciones'] },
  { title: 'Operaciones', items: ['Operaciones', 'Estimados', 'Ops. de Campo', 'Calendario', 'Cuadrillas'] },
  { title: 'Agentes & Ferias', items: ['Agentes'] },
  { title: 'Calidad', items: ['Incidencias', 'Reclamaciones'] },
];

const toDisplayName = (raw?: string) => {
  if (!raw) return 'Usuario';
  return raw
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

const toInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

function AdminShell({
  title,
  subtitle,
  activeItem,
  quickActions = [],
  children,
}: AdminShellProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const displayName = useMemo(() => toDisplayName(user?.username), [user?.username]);
  const initials = useMemo(() => toInitials(displayName), [displayName]);
  const primaryRole = useMemo(
    () => toDisplayName(user?.role || user?.roles?.[0] || 'Administrador'),
    [user?.role, user?.roles],
  );

  const onNav = async (item: string) => {
    if (item === 'Dashboard') navigate('/dashboard');
    if (item === 'Flujo Comercial') navigate('/dashboard/comercial');
  };

  const handleLogout = async () => {
    await logout();
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
                <button
                  key={item}
                  className={item === activeItem ? 'is-active' : ''}
                  type="button"
                  onClick={() => onNav(item)}
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
            <h1>{title}</h1>
            <p>{subtitle}</p>
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

        {children}
      </main>
    </div>
  );
}

export default AdminShell;
