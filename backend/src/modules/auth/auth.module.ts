import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PrAuthAuditoria } from '../rrhh/entities/pr-auth-auditoria.entity';
import { PrRefreshToken } from '../rrhh/entities/pr-refresh-token.entity';
import { AuthAuditService } from './auth-audit.service';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([PrRefreshToken, PrAuthAuditoria]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        const jwtExpiresInSeconds = configService.get<string>('JWT_EXPIRES_IN_SECONDS');
        const jwtExpiresInLegacy = configService.get<string>('JWT_EXPIRES_IN');

        if (!jwtSecret) {
          throw new Error('JWT_SECRET es obligatorio. Configúralo en backend/.env (puedes usar backend/.env.example).');
        }

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: (jwtExpiresInSeconds
              ? Number(jwtExpiresInSeconds)
              : jwtExpiresInLegacy || '8h') as any,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthAuditService, JwtStrategy, PermissionsGuard],
  exports: [AuthService],
})
export class AuthModule {}
