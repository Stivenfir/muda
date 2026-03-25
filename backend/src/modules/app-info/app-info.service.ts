import { Injectable } from '@nestjs/common';

@Injectable()
export class AppInfoService {
  getInfo() {
    return {
      name: process.env.APP_NAME ?? 'ABC Mudanzas API',
      version: process.env.APP_VERSION ?? '1.0.0',
      environment: process.env.NODE_ENV ?? 'development',
    };
  }
}