import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pr_auth_auditoria')
export class PrAuthAuditoria {
  @PrimaryGeneratedColumn({ name: 'auth_auditoria_id' })
  authAuditoriaId: number;

  @Column({ name: 'evento', type: 'varchar', length: 60 })
  evento: string;

  @Column({ name: 'resultado', type: 'varchar', length: 20 })
  resultado: 'OK' | 'ERROR';

  @Column({ name: 'empleado_id', nullable: true })
  empleadoId?: number;

  @Column({ name: 'nombre_usuario', type: 'varchar', length: 80, nullable: true })
  nombreUsuario?: string;

  @Column({ name: 'ip', type: 'varchar', length: 45, nullable: true })
  ip?: string;

  @Column({ name: 'user_agent', type: 'varchar', length: 255, nullable: true })
  userAgent?: string;

  @Column({ name: 'motivo', type: 'varchar', length: 255, nullable: true })
  motivo?: string;

  @Column({ name: 'metadata', type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
