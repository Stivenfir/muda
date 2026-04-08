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
    const flattenedDeals = this.extractOpenOpportunities(payload);
    this.logger.log(
      `Open opportunities normalized: ${flattenedDeals.length}`,
    );
    return flattenedDeals;
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

    if (!payload || typeof payload !== 'object') {
      return [];
    }

    const objectPayload = payload as Record<string, unknown>;
    const candidates = ['items', 'results', 'deals', 'clients'];

    for (const key of candidates) {
      const value = objectPayload[key];
      if (Array.isArray(value)) {
        return value as ClientifyDeal[];
      }
    }

    const data = objectPayload['data'];
    if (data && typeof data === 'object') {
      const dataPayload = data as Record<string, unknown>;
      for (const key of candidates) {
        const value = dataPayload[key];
        if (Array.isArray(value)) {
          return value as ClientifyDeal[];
        }
      }
    }

    return [];
  }

  private extractOpenOpportunities(payload: unknown): ClientifyDeal[] {
    const firstPass = this.extractArray(payload);
    if (firstPass.length === 0) {
      return [];
    }

    const hasOpenOpportunities = firstPass.some((item) =>
      Array.isArray((item as Record<string, unknown>).openOpportunities),
    );

    if (!hasOpenOpportunities) {
      return firstPass;
    }

    const deals: ClientifyDeal[] = [];

    for (const clientItem of firstPass as Array<Record<string, unknown>>) {
      const rawClientId = clientItem.contactId || clientItem.id || null;
      const clientId =
        typeof rawClientId === 'string' || typeof rawClientId === 'number'
          ? rawClientId
          : null;
      const clientName =
        (clientItem.contactName as string) ||
        (clientItem.name as string) ||
        (clientItem.fullName as string) ||
        'Sin nombre';
      const companyName =
        (clientItem.companyName as string) || (clientItem.company as string) || null;

      const opportunities = Array.isArray(clientItem.openOpportunities)
        ? (clientItem.openOpportunities as Array<Record<string, unknown>>)
        : [];

      for (const opportunity of opportunities) {
        const normalizedContactId =
          typeof opportunity.contactId === 'string' ||
          typeof opportunity.contactId === 'number'
            ? opportunity.contactId
            : clientId;

        deals.push({
          ...opportunity,
          contactId: normalizedContactId,
          contactName:
            (opportunity.contactName as string) ||
            clientName,
          companyName:
            (opportunity.companyName as string) ||
            companyName,
        });
      }
    }

    return deals;
  }
}
