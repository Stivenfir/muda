import { Injectable } from '@nestjs/common';
import { ComercialDashboardQueryDto } from './dto/comercial-dashboard-query.dto';
import { ComercialDashboardResponse } from './interfaces/commercial-dashboard.interface';
import { ClientifyCommercialDataService } from './services/clientify-commercial-data.service';
import { MudanzasDashboardBuilderService } from './services/mudanzas-dashboard-builder.service';
import { MudanzasDashboardCacheService } from './services/mudanzas-dashboard-cache.service';

@Injectable()
export class MudanzasDashboardService {
  constructor(
    private readonly clientifyService: ClientifyCommercialDataService,
    private readonly builderService: MudanzasDashboardBuilderService,
    private readonly cacheService: MudanzasDashboardCacheService,
  ) {}

  async getComercialDashboard(
    query: ComercialDashboardQueryDto,
  ): Promise<ComercialDashboardResponse> {
    const pipeline = query.pipeline || 'mudanzas';
    const stage = query.stage || 'en costeo';
    const pageSize = query.pageSize || 100;
    const ttlSeconds = query.ttlSeconds || 120;

    const cacheKey = this.buildCacheKey({ pipeline, stage, pageSize });
    const cached = this.cacheService.get(cacheKey);

    if (cached) {
      return {
        ...cached,
        meta: {
          ...cached.meta,
          cached: true,
          ttlSeconds,
        },
      };
    }

    return this.refreshComercialDashboard(query);
  }

  async refreshComercialDashboard(
    query: ComercialDashboardQueryDto,
  ): Promise<ComercialDashboardResponse> {
    const pipeline = query.pipeline || 'mudanzas';
    const stage = query.stage || 'en costeo';
    const pageSize = query.pageSize || 100;
    const ttlSeconds = query.ttlSeconds || 120;

    const [deals, quotationPendingDeals] = await Promise.all([
      this.clientifyService.getMudanzasDeals(),
      this.clientifyService.getOpenOpportunitiesInCosteo({
        pipeline,
        stage,
        pageSize,
      }),
    ]);

    const payload = this.builderService.buildDashboard({
      deals,
      quotationPendingDeals,
      ttlSeconds,
      cached: false,
    });

    this.cacheService.set(this.buildCacheKey({ pipeline, stage, pageSize }), payload, ttlSeconds);

    return payload;
  }

  private buildCacheKey(params: {
    pipeline: string;
    stage: string;
    pageSize: number;
  }): string {
    const pipelineKey = params.pipeline.trim().toLowerCase();
    const stageKey = params.stage.trim().toLowerCase().replace(/\s+/g, '_');
    return `mudanzas:dashboard:comercial:${pipelineKey}:${stageKey}:${params.pageSize}`;
  }
}
