import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    return {
      status: 'ok',
      service: process.env.APP_NAME ?? 'ABC Mudanzas API',
      timestamp: new Date().toISOString(),
    };
  }

  getLive() {
    return {
      status: 'live',
      timestamp: new Date().toISOString(),
    };
  }

  getReady() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }
}