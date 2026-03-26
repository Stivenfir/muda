import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppInfoModule } from './modules/app-info/app-info.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { PrEmpleado } from './modules/rrhh/entities/pr-empleado.entity';
import { PrEmpleadoRol } from './modules/rrhh/entities/pr-empleado-rol.entity';
import { PrPersona } from './modules/rrhh/entities/pr-persona.entity';
import { PrRol } from './modules/rrhh/entities/pr-rol.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || undefined,
      database: process.env.DB_DATABASE || 'abcmudanzas',
      entities: [PrPersona, PrEmpleado, PrRol, PrEmpleadoRol],
      synchronize: false,
    }),
    HealthModule,
    AppInfoModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}