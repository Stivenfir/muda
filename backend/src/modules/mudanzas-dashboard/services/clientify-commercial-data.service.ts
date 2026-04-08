import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientifyDeal } from '../interfaces/commercial-dashboard.interface';

@Injectable()
export class ClientifyCommercialDataService {
  private readonly logger = new Logger(ClientifyCommercialDataService.name);

  constructor(private readonly configService: ConfigService) {}

  async getMudanzasDeals(): Promise<ClientifyDeal[]> {
    const payload = await this.fetchJson('/api/clientify/deals');
    return this.extractArray(payload);
  }

  async getOpenOpportunitiesInCosteo(params: {
    pipeline: string;
    stage: string;
    pageSize: number;
  }): Promise<ClientifyDeal[]> {
    const searchParams = new URLSearchParams({
      pipeline: params.pipeline,
      stage: params.stage,
      pageSize: String(params.pageSize),
    });

    const payload = await this.fetchJson(
      `/api/clientify/clients/open-opportunities?${searchParams.toString()}`,
    );

    return this.extractArray(payload);
  }

  private getBaseUrl(): string {
    const explicitBase = this.configService.get<string>('CLIENTIFY_INTERNAL_BASE_URL');
    if (explicitBase) {
      return explicitBase.replace(/\/$/, '');
    }

    const port = this.configService.get<string>('PORT') || '3000';
    return `http://127.0.0.1:${port}`;
  }

  private async fetchJson(path: string): Promise<unknown> {
    const url = `${this.getBaseUrl()}${path}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.logger.warn(`Clientify endpoint ${url} respondió ${response.status}`);
        return [];
      }

      return await response.json();
    } catch (error) {
      this.logger.warn(`No se pudo consultar ${url}: ${String(error)}`);
      return [];
    }
  }

  private extractArray(payload: unknown): ClientifyDeal[] {
    if (Array.isArray(payload)) {
      return payload as ClientifyDeal[];
    }

    if (payload && typeof payload === 'object') {
      const objectPayload = payload as Record<string, unknown>;
      const candidates = ['items', 'data', 'results', 'deals', 'clients'];

      for (const key of candidates) {
        const value = objectPayload[key];
        if (Array.isArray(value)) {
          return value as ClientifyDeal[];
        }
      }
    }

    return [];
  }
}
