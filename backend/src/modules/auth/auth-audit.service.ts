import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrAuthAuditoria } from '../rrhh/entities/pr-auth-auditoria.entity';

type AuthAuditEventInput = {
  evento: string;
  resultado: 'OK' | 'ERROR';
  empleadoId?: number;
  nombreUsuario?: string;
  ip?: string;
  userAgent?: string;
  motivo?: string;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class AuthAuditService {
  constructor(
    @InjectRepository(PrAuthAuditoria)
    private readonly authAuditRepository: Repository<PrAuthAuditoria>,
  ) {}

  async register(input: AuthAuditEventInput): Promise<void> {
    const event = this.authAuditRepository.create({
      ...input,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : undefined,
    });
    await this.authAuditRepository.save(event);
  }
}
