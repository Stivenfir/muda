import AdminShell from '../../components/dashboard/AdminShell';
import './DashboardPage.css';

const metrics = [
  { label: 'Operaciones Activas', value: '5', trend: '+12% vs mes anterior' },
  { label: 'Pipeline Total', value: '$94.5K', trend: '+8% vs mes anterior' },
  { label: 'Tasa de Conversión', value: '18%', trend: '+5% vs mes anterior' },
  { label: 'Cotizaciones Pendientes', value: '3', trend: '-2% vs mes anterior' },
];

function DashboardPage() {
  return (
    <AdminShell
      title="Dashboard Ejecutivo"
      subtitle="Vista general de operaciones y desempeño"
      activeItem="Dashboard"
      quickActions={[{ label: 'Nuevo Lead' }, { label: 'Nuevo Costeo' }]}
    >
      <section className="main-metrics-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="main-metric-card">
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <small>{metric.trend}</small>
          </article>
        ))}
      </section>

      <section className="main-card">
        <h2>Alertas Accionables</h2>
        <div className="main-highlight-row">
          <span>1 incidencia(s) abiertas</span>
          <button type="button">Gestionar</button>
        </div>
      </section>

      <section className="main-card">
        <div className="main-title-row">
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ABC-EXP-2026-001</td>
              <td>Juan Pérez</td>
              <td>Bogotá → Miami, FL</td>
              <td><span className="phase-chip">expo_destino_agente</span></td>
              <td><span className="health-dot is-ok" /></td>
            </tr>
            <tr>
              <td>ABC-EXP-2026-002</td>
              <td>Sarah Johnson</td>
              <td>Lima → Houston, TX</td>
              <td><span className="phase-chip">expo_transito</span></td>
              <td><span className="health-dot is-warning" /></td>
            </tr>
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}

export default DashboardPage;
