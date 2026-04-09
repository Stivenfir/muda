import { useEffect, useMemo, useState } from 'react';
import AdminShell from '../../components/dashboard/AdminShell';
import { getComercialDashboard } from '../../services/mudanzasDashboardService';
import type { ComercialDashboardResponse } from '../../types/mudanzasDashboard.types';
import './CommercialFlowPage.css';

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);

function CommercialFlowPage() {
  const [dashboard, setDashboard] = useState<ComercialDashboardResponse | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [activeSegment, setActiveSegment] = useState<'agentes' | 'corporativo' | 'personaNatural'>(
    'agentes',
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

  const summaryCards = [
    { label: 'Leads nuevos', value: String(dashboard?.summary.leadsNuevos ?? 0) },
    {
      label: 'Cotizaciones enviadas',
      value: String(dashboard?.summary.cotizacionesEnviadas ?? 0),
    },
    { label: 'Operaciones ganadas', value: String(dashboard?.summary.operacionesGanadas ?? 0) },
    {
      label: 'Valor pipeline',
      value: formatCurrency(dashboard?.summary.valorPipeline ?? 0),
    },
  ];

  const segmentCounts = useMemo(() => {
    const pending = dashboard?.quotationPending ?? [];
    const totals = {
      agentes: 0,
      corporativo: 0,
      personaNatural: 0,
    };

    for (const item of pending) {
      const company = (item.companyName || '').toLowerCase();
      if (company.includes('persona natural')) {
        totals.personaNatural += 1;
      } else if (company.includes('corporat')) {
        totals.corporativo += 1;
      } else {
        totals.agentes += 1;
      }
    }

    return totals;
  }, [dashboard?.quotationPending]);

  return (
    <AdminShell
      title="Mi Escritorio Comercial"
      subtitle={`Centro de control del ejecutivo comercial · ${weekday}`}
      activeItem="Flujo Comercial"
      quickActions={[{ label: 'Registrar Nueva Operación' }]}
    >
      {loadingDashboard && (
        <section className="flow-loader-card" aria-live="polite">
          <div className="flow-loader-ring" />
          <strong>Cargando escritorio comercial</strong>
          <p>Sincronizando oportunidades y tareas desde Clientify...</p>
        </section>
      )}
      {dashboardError && <section className="flow-card flow-error">{dashboardError}</section>}

      {!loadingDashboard && !dashboardError && dashboard && (
        <>
          <section className="flow-segment-strip">
            <button
              type="button"
              className={activeSegment === 'agentes' ? 'is-active' : ''}
              onClick={() => setActiveSegment('agentes')}
            >
              🌐 Agentes <b>{segmentCounts.agentes}</b>
            </button>
            <button
              type="button"
              className={activeSegment === 'corporativo' ? 'is-active' : ''}
              onClick={() => setActiveSegment('corporativo')}
            >
              🏢 Corporativo <b>{segmentCounts.corporativo}</b>
            </button>
            <button
              type="button"
              className={activeSegment === 'personaNatural' ? 'is-active' : ''}
              onClick={() => setActiveSegment('personaNatural')}
            >
              👤 Persona Natural <b>{segmentCounts.personaNatural}</b>
            </button>
          </section>

          <section className="flow-banner">
            <strong>Negocio del Agente</strong>
            <small>Requerimientos de agentes internacionales</small>
          </section>

          <section className="flow-metrics-grid">
            {summaryCards.map((metric) => (
              <article key={metric.label} className="flow-metric-card">
                <strong>{metric.value}</strong>
                <p>{metric.label}</p>
              </article>
            ))}
          </section>

          <section className="flow-card">
            <div className="flow-title-row">
              <h2>Mis Tareas Pendientes</h2>
              <span>{dashboard.pendingTasks.length}</span>
            </div>

            <div className="flow-task-grid">
              {dashboard.pendingTasks.map((task) => (
                <article key={task.id} className={task.source === 'clientify' ? 'flow-task-card is-live' : 'flow-task-card'}>
                  <div className="flow-task-top">
                    <strong>{task.title}</strong>
                    <small>{task.dueInDays}d</small>
                  </div>
                  <p>{task.subtitle}</p>
                  <button type="button">{task.actionLabel}</button>
                </article>
              ))}
            </div>
          </section>

          <section className="flow-card flow-table-block">
            <div className="flow-title-row">
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

          <footer className="flow-footer">
            Fuente: {dashboard.meta.source} · Cache: {dashboard.meta.cached ? 'Sí' : 'No'} · Generado:{' '}
            {new Date(dashboard.meta.generatedAt).toLocaleString('es-CO')}
          </footer>
        </>
      )}
    </AdminShell>
  );
}

export default CommercialFlowPage;
