import { Module } from '@nestjs/common';
import { MudanzasDashboardController } from './mudanzas-dashboard.controller';
import { MudanzasDashboardService } from './mudanzas-dashboard.service';
import { ClientifyCommercialDataService } from './services/clientify-commercial-data.service';
import { MudanzasDashboardBuilderService } from './services/mudanzas-dashboard-builder.service';
import { MudanzasDashboardCacheService } from './services/mudanzas-dashboard-cache.service';

@Module({
  controllers: [MudanzasDashboardController],
  providers: [
    MudanzasDashboardService,
    ClientifyCommercialDataService,
    MudanzasDashboardBuilderService,
    MudanzasDashboardCacheService,
  ],
  exports: [MudanzasDashboardService],
})
export class MudanzasDashboardModule {}
