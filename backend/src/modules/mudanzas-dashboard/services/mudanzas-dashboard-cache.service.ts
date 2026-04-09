import { Injectable, Logger } from '@nestjs/common';
import { ComercialDashboardResponse } from '../interfaces/commercial-dashboard.interface';

type CacheEntry = {
  expiresAt: number;
  value: ComercialDashboardResponse;
};

@Injectable()
export class MudanzasDashboardCacheService {
  private readonly logger = new Logger(MudanzasDashboardCacheService.name);
  private readonly store = new Map<string, CacheEntry>();

  get(key: string): ComercialDashboardResponse | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.logger.debug(`CACHE MISS key=${key}`);
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      this.logger.debug(`CACHE EXPIRED key=${key}`);
      this.store.delete(key);
      return null;
    }

    this.logger.debug(`CACHE HIT key=${key}`);
    return entry.value;
  }

  set(key: string, value: ComercialDashboardResponse, ttlSeconds: number): void {
    this.logger.debug(`CACHE SET key=${key} ttlSeconds=${ttlSeconds}`);
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  del(key: string): void {
    this.store.delete(key);
  }
}
