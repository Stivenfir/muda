export interface DashboardSummary {
  leadsNuevos: number;
  cotizacionesEnviadas: number;
  operacionesGanadas: number;
  valorPipeline: number;
}

export interface DashboardQuotationPendingItem {
  dealId: number;
  dealName: string;
  contactId: number;
  contactName: string;
  companyName: string | null;
  stageName: string | null;
  pipelineName: string | null;
  updatedAt: string | null;
  value: number;
  currency: string | null;
}

export interface DashboardPendingTask {
  id: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  dueInDays: number;
  source: 'placeholder' | 'clientify';
}

export interface DashboardOperationRow {
  code: string;
  client: string;
  type: string;
  route: string;
  stage: string;
  docsProgress: string;
  nextAction: string;
  daysInStage: number;
  source: 'placeholder' | 'clientify';
}

export interface DashboardMeta {
  generatedAt: string;
  source: string;
  cached: boolean;
  ttlSeconds: number;
}

export interface ComercialDashboardResponse {
  summary: DashboardSummary;
  quotationPending: DashboardQuotationPendingItem[];
  pendingTasks: DashboardPendingTask[];
  operations: DashboardOperationRow[];
  meta: DashboardMeta;
}

export interface ClientifyDeal {
  id?: number;
  name?: string;
  value?: number | string;
  status?: number | string;
  pipelineId?: number | string;
  pipelineName?: string;
  stageId?: number | string;
  stageName?: string;
  contactId?: number | string | null;
  contactName?: string;
  companyName?: string | null;
  updatedAt?: string;
  wonAt?: string | null;
  [key: string]: unknown;
}
