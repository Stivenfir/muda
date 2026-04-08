import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ComercialDashboardQueryDto } from './dto/comercial-dashboard-query.dto';
import { MudanzasDashboardService } from './mudanzas-dashboard.service';

@ApiTags('Mudanzas Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mudanzas/dashboard')
export class MudanzasDashboardController {
  constructor(private readonly dashboardService: MudanzasDashboardService) {}

  @Get('comercial')
  @ApiOperation({
    summary: 'Obtiene el dashboard comercial de mudanzas (con caché)',
  })
  getComercialDashboard(@Query() query: ComercialDashboardQueryDto) {
    return this.dashboardService.getComercialDashboard(query);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresca manualmente el dashboard comercial de mudanzas',
  })
  refreshComercialDashboard(@Body() query: ComercialDashboardQueryDto) {
    return this.dashboardService.refreshComercialDashboard(query);
  }
}
