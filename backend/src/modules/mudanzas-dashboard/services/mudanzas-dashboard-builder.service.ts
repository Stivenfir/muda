import { Injectable } from '@nestjs/common';
import {
  ClientifyDeal,
  ComercialDashboardResponse,
  DashboardOperationRow,
  DashboardPendingTask,
  DashboardQuotationPendingItem,
  DashboardSummary,
} from '../interfaces/commercial-dashboard.interface';

@Injectable()
export class MudanzasDashboardBuilderService {
  buildDashboard(params: {
    deals: ClientifyDeal[];
    quotationPendingDeals: ClientifyDeal[];
    ttlSeconds: number;
    cached: boolean;
  }): ComercialDashboardResponse {
    const summary = this.buildSummary(params.deals);
    const quotationPending = this.buildQuotationPending(params.quotationPendingDeals);

    return {
      summary,
      quotationPending,
      pendingTasks: this.buildPendingTasks(quotationPending),
      operations: this.buildOperations(),
      meta: {
        generatedAt: new Date().toISOString(),
        source: 'clientify+mudanzas-dashboard',
        cached: params.cached,
        ttlSeconds: params.ttlSeconds,
      },
    };
  }

  private buildSummary(deals: ClientifyDeal[]): DashboardSummary {
    const leadsNuevos = deals.filter((deal) => this.matchesStage(deal.stageName, ['lead'])).length;

    const cotizacionesEnviadas = deals.filter((deal) =>
      this.matchesStage(deal.stageName, ['cotiz', 'costeo']),
    ).length;

    const operacionesGanadas = deals.filter((deal) => this.isWonDeal(deal)).length;

    const valorPipeline = deals.reduce((acc, deal) => acc + this.asNumber(deal.value), 0);

    return {
      leadsNuevos,
      cotizacionesEnviadas,
      operacionesGanadas,
      valorPipeline,
    };
  }

  private buildQuotationPending(deals: ClientifyDeal[]): DashboardQuotationPendingItem[] {
    return deals
      .filter((deal) => this.isOpenDeal(deal.status) && this.asNullableNumber(deal.contactId) !== null)
      .map((deal) => ({
        dealId: this.asNumber(deal.id),
        dealName: String(deal.name || `Deal ${deal.id || ''}`).trim(),
        contactId: this.asNumber(deal.contactId),
        contactName: String(deal.contactName || 'Sin nombre'),
        companyName: deal.companyName ? String(deal.companyName) : null,
        stageName: deal.stageName ? String(deal.stageName) : null,
        pipelineName: deal.pipelineName ? String(deal.pipelineName) : null,
        updatedAt: deal.updatedAt ? String(deal.updatedAt) : null,
        value: this.asNumber(deal.value),
        currency: 'USD',
      }));
  }

  private buildPendingTasks(
    quotationPending: DashboardQuotationPendingItem[],
  ): DashboardPendingTask[] {
    if (quotationPending.length === 0) {
      return [
        {
          id: 'placeholder-task-1',
          title: 'Sin tareas comerciales críticas por ahora',
          subtitle: 'Estructura lista para conectar tareas reales del flujo comercial.',
          actionLabel: 'Sin acciones pendientes',
          dueInDays: 0,
          source: 'placeholder',
        },
      ];
    }

    return quotationPending.slice(0, 5).map((item, index) => ({
      id: `quotation-${item.dealId || index}`,
      title: item.contactName,
      subtitle: `Crear cotización para ${item.dealName}`,
      actionLabel: 'Crear Cotización',
      dueInDays: 2 + index,
      source: 'clientify',
    }));
  }

  private buildOperations(): DashboardOperationRow[] {
    return [
      {
        code: 'PEND-OPS-001',
        client: 'Pendiente de integración',
        type: 'Exportación',
        route: 'Origen → Destino',
        stage: 'En diseño',
        docsProgress: '0/12',
        nextAction: 'Conectar fuente definitiva de operaciones',
        daysInStage: 0,
        source: 'placeholder',
      },
    ];
  }

  private asNumber(input: unknown): number {
    const numericValue = Number(input);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  private asNullableNumber(input: unknown): number | null {
    const numericValue = Number(input);
    if (!Number.isFinite(numericValue)) {
      return null;
    }

    return numericValue;
  }

  private isOpenDeal(status: unknown): boolean {
    const numericValue = Number(status);
    return numericValue === 1;
  }

  private isWonDeal(deal: ClientifyDeal): boolean {
    if (typeof deal.wonAt === 'string' && deal.wonAt.length > 0) {
      return true;
    }

    return this.matchesStage(deal.stageName, ['ganad', 'closed won']);
  }

  private matchesStage(stageName: unknown, candidates: string[]): boolean {
    const stage = String(stageName || '').toLowerCase();
    return candidates.some((candidate) => stage.includes(candidate));
  }
}
