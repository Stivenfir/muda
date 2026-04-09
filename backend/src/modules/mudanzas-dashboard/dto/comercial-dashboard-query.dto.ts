import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ComercialDashboardQueryDto {
  @IsOptional()
  @IsString()
  pipeline?: string = 'mudanzas';

  @IsOptional()
  @IsString()
  stage?: string = 'en costeo';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  pageSize?: number = 100;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(3600)
  ttlSeconds?: number = 120;
}
