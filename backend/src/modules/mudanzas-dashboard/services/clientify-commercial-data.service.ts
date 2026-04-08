import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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

    return 'http://127.0.0.1:3001';
  }

  private getApiKey(): string {
    return (
      this.configService.get<string>('CLIENTIFY_INTERNAL_API_KEY') ||
      'abc_clientify_2026'
    );
  }

  private async fetchJson(path: string): Promise<unknown> {
    const url = `${this.getBaseUrl()}${path}`;
    const apiKey = this.getApiKey();
    this.logger.log(`Calling Clientify URL: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      });
      this.logger.log(`Response status: ${response.status} (${url})`);

      if (!response.ok) {
        const responseText = await response.text();
        this.logger.error(
          `Clientify request failed. URL=${url} STATUS=${response.status} BODY=${responseText}`,
        );
        throw new InternalServerErrorException(
          `Clientify request failed with status ${response.status}`,
        );
      }

      const payload = await response.json();
      const recordsCount = this.extractArray(payload).length;
      this.logger.log(`Records received: ${recordsCount} (${url})`);
      return payload;
    } catch (error) {
      this.logger.error(
        `Clientify request error. URL=${url} ERROR=${String(error)}`,
      );
      throw new InternalServerErrorException(
        'Failed to consume internal Clientify API',
      );
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
