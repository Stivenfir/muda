import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrEmpleadoRol } from './pr-empleado-rol.entity';
import { PrRolPermiso } from './pr-rol-permiso.entity';

@Entity('pr_rol')
export class PrRol {
  @PrimaryGeneratedColumn({ name: 'rol_id' })
  rolId: number;

  @Column({ name: 'codigo_rol', type: 'varchar', length: 40, unique: true })
  codigoRol: string;

  @Column({ name: 'nombre_rol', type: 'varchar', length: 100 })
  nombreRol: string;

  @Column({ name: 'descripcion', type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @Column({ name: 'esta_activo', type: 'boolean', default: true })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => PrEmpleadoRol, (empleadoRol) => empleadoRol.rol)
  empleados: PrEmpleadoRol[];

  @OneToMany(() => PrRolPermiso, (rolPermiso) => rolPermiso.rol)
  permisos: PrRolPermiso[];
}
