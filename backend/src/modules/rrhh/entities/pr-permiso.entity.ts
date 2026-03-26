import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrRolPermiso } from './pr-rol-permiso.entity';

@Entity('pr_permiso')
export class PrPermiso {
  @PrimaryGeneratedColumn({ name: 'permiso_id' })
  permisoId: number;

  @Column({ name: 'codigo_permiso', type: 'varchar', length: 120, unique: true })
  codigoPermiso: string;

  @Column({ name: 'nombre_permiso', type: 'varchar', length: 150 })
  nombrePermiso: string;

  @Column({ name: 'descripcion', type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @Column({ name: 'esta_activo', type: 'boolean', default: true })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => PrRolPermiso, (rolPermiso) => rolPermiso.permiso)
  roles: PrRolPermiso[];
}
