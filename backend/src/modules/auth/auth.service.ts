import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PrRefreshToken } from '../rrhh/entities/pr-refresh-token.entity';
import { AuthAuditService } from './auth-audit.service';

@Injectable()
export class AuthService {
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly WINDOW_MS = 15 * 60 * 1000;
  private readonly failedAttempts = new Map<string, number[]>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly authAuditService: AuthAuditService,
    @InjectRepository(PrRefreshToken)
    private readonly refreshTokenRepository: Repository<PrRefreshToken>,
  ) {}

  async login(username: string, password: string, ip?: string, userAgent?: string) {
    this.validateRateLimit(username, ip);

    const user = await this.usersService.findByUsername(username);

    if (!user) {
      await this.registerFailedAttempt(username, ip, userAgent, 'USUARIO_NO_EXISTE');
      throw new UnauthorizedException({ code: 'AUTH_INVALID_CREDENTIALS', message: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await this.registerFailedAttempt(username, ip, userAgent, 'PASSWORD_INVALIDA');
      throw new UnauthorizedException({ code: 'AUTH_INVALID_CREDENTIALS', message: 'Credenciales inválidas' });
    }

    this.clearFailedAttempts(username, ip);

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      roles: user.roles,
      permissions: user.permissions,
    };
    const refreshToken = randomUUID();
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const refreshTtlDays = Number(process.env.AUTH_REFRESH_TTL_DAYS || 7);
    const refreshTokenExpiry = new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.insert({
      empleadoId: user.id,
      tokenHash: refreshTokenHash,
      expiraEn: refreshTokenExpiry,
      revocadoEn: null,
      creadoDesdeIp: ip || null,
      estaActivo: true,
    });

    await this.authAuditService.register({
      evento: 'LOGIN',
      resultado: 'OK',
      empleadoId: user.id,
      nombreUsuario: user.username,
      ip,
      userAgent,
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: payload,
    };
  }

  async refresh(refreshToken: string, ip?: string, userAgent?: string) {
    const activeRefreshTokens = await this.refreshTokenRepository.find({
      where: {
        estaActivo: true,
        revocadoEn: IsNull(),
        expiraEn: MoreThan(new Date()),
      },
      take: 100,
      order: { refreshTokenId: 'DESC' },
    });

    let matchedToken: PrRefreshToken | null = null;

    for (const tokenRecord of activeRefreshTokens) {
      const isMatch = await bcrypt.compare(refreshToken, tokenRecord.tokenHash);

      if (isMatch) {
        matchedToken = tokenRecord;
        break;
      }
    }

    if (!matchedToken) {
      await this.authAuditService.register({
        evento: 'REFRESH_TOKEN',
        resultado: 'ERROR',
        ip,
        userAgent,
        motivo: 'REFRESH_INVALIDO',
      });
      throw new UnauthorizedException({ code: 'AUTH_REFRESH_INVALID', message: 'Refresh token inválido' });
    }

    const user = await this.usersService.findById(matchedToken.empleadoId);

    if (!user) {
      throw new UnauthorizedException({ code: 'AUTH_USER_INACTIVE', message: 'Usuario no disponible' });
    }

    await this.refreshTokenRepository.update(
      { refreshTokenId: matchedToken.refreshTokenId },
      { revocadoEn: new Date(), estaActivo: false },
    );

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      roles: user.roles,
      permissions: user.permissions,
    };

    const newRefreshToken = randomUUID();
    const newRefreshHash = await bcrypt.hash(newRefreshToken, 10);
    const refreshTtlDays = Number(process.env.AUTH_REFRESH_TTL_DAYS || 7);
    const refreshTokenExpiry = new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.insert({
      empleadoId: user.id,
      tokenHash: newRefreshHash,
      expiraEn: refreshTokenExpiry,
      revocadoEn: null,
      creadoDesdeIp: ip || null,
      estaActivo: true,
    });

    await this.authAuditService.register({
      evento: 'REFRESH_TOKEN',
      resultado: 'OK',
      empleadoId: user.id,
      nombreUsuario: user.username,
      ip,
      userAgent,
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: newRefreshToken,
      user: payload,
    };
  }

  async logout(userId: number, refreshToken?: string, ip?: string, userAgent?: string) {
    if (refreshToken) {
      const tokens = await this.refreshTokenRepository.find({
        where: { empleadoId: userId, estaActivo: true, revocadoEn: IsNull() },
      });

      for (const tokenRecord of tokens) {
        if (await bcrypt.compare(refreshToken, tokenRecord.tokenHash)) {
          await this.refreshTokenRepository.update(
            { refreshTokenId: tokenRecord.refreshTokenId },
            { revocadoEn: new Date(), estaActivo: false },
          );
        }
      }
    } else {
      await this.refreshTokenRepository.update(
        { empleadoId: userId, estaActivo: true, revocadoEn: IsNull() },
        { revocadoEn: new Date(), estaActivo: false },
      );
    }

    await this.authAuditService.register({
      evento: 'LOGOUT',
      resultado: 'OK',
      empleadoId: userId,
      ip,
      userAgent,
    });

    return { success: true };
  }

  private validateRateLimit(username: string, ip?: string): void {
    const key = `${username.toLowerCase()}|${ip || 'unknown'}`;
    const current = this.failedAttempts.get(key) ?? [];
    const threshold = Date.now() - AuthService.WINDOW_MS;
    const active = current.filter((attempt) => attempt >= threshold);

    if (active.length >= AuthService.MAX_ATTEMPTS) {
      throw new HttpException({
        code: 'AUTH_RATE_LIMIT',
        message: 'Demasiados intentos, inténtalo más tarde',
      }, HttpStatus.TOO_MANY_REQUESTS);
    }

    this.failedAttempts.set(key, active);
  }

  private async registerFailedAttempt(
    username: string,
    ip?: string,
    userAgent?: string,
    reason = 'CREDENCIALES_INVALIDAS',
  ): Promise<void> {
    const key = `${username.toLowerCase()}|${ip || 'unknown'}`;
    const current = this.failedAttempts.get(key) ?? [];
    current.push(Date.now());
    this.failedAttempts.set(key, current);

    await this.authAuditService.register({
      evento: 'LOGIN',
      resultado: 'ERROR',
      nombreUsuario: username,
      ip,
      userAgent,
      motivo: reason,
    });
  }

  private clearFailedAttempts(username: string, ip?: string): void {
    const key = `${username.toLowerCase()}|${ip || 'unknown'}`;
    this.failedAttempts.delete(key);
  }
}
