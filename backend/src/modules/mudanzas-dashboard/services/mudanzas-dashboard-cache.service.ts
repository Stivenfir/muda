import { Injectable } from '@nestjs/common';
import { ComercialDashboardResponse } from '../interfaces/commercial-dashboard.interface';

type CacheEntry = {
  expiresAt: number;
  value: ComercialDashboardResponse;
};

@Injectable()
export class MudanzasDashboardCacheService {
  private readonly store = new Map<string, CacheEntry>();

  get(key: string): ComercialDashboardResponse | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key: string, value: ComercialDashboardResponse, ttlSeconds: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  del(key: string): void {
    this.store.delete(key);
  }
}
