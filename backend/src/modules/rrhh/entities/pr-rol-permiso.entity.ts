import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrPermiso } from './pr-permiso.entity';
import { PrRol } from './pr-rol.entity';

@Entity('pr_rol_permiso')
export class PrRolPermiso {
  @PrimaryGeneratedColumn({ name: 'rol_permiso_id' })
  rolPermisoId: number;

  @Column({ name: 'rol_id' })
  rolId: number;

  @Column({ name: 'permiso_id' })
  permisoId: number;

  @Column({ name: 'esta_activo', type: 'boolean', default: true })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @ManyToOne(() => PrRol, (rol) => rol.permisos)
  @JoinColumn({ name: 'rol_id' })
  rol: PrRol;

  @ManyToOne(() => PrPermiso, (permiso) => permiso.roles)
  @JoinColumn({ name: 'permiso_id' })
  permiso: PrPermiso;
}
