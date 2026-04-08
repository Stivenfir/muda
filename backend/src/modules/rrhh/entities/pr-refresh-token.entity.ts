import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PrEmpleado } from './pr-empleado.entity';

@Entity('pr_refresh_token')
export class PrRefreshToken {
  @PrimaryGeneratedColumn({ name: 'refresh_token_id' })
  refreshTokenId: number;

  @Column({ name: 'empleado_id' })
  empleadoId: number;

  @Column({ name: 'token_hash', type: 'varchar', length: 255 })
  tokenHash: string;

  @Column({ name: 'expira_en', type: 'datetime' })
  expiraEn: Date;

  @Column({ name: 'revocado_en', type: 'datetime', nullable: true })
  revocadoEn: Date | null;

  @Column({ name: 'creado_desde_ip', type: 'varchar', length: 45, nullable: true })
  creadoDesdeIp: string | null;

  @Column({ name: 'esta_activo', type: 'boolean', default: true })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @ManyToOne(() => PrEmpleado)
  @JoinColumn({ name: 'empleado_id' })
  empleado: PrEmpleado;
}
