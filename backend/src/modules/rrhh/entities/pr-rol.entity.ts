import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrEmpleadoRol } from './pr-empleado-rol.entity';

@Entity('pr_rol')
export class PrRol {
  @PrimaryGeneratedColumn({ name: 'rol_id' })
  rolId: number;

  @Column({ name: 'codigo_rol', length: 40, unique: true })
  codigoRol: string;

  @Column({ name: 'nombre_rol', length: 100 })
  nombreRol: string;

  @Column({ name: 'descripcion', length: 255, nullable: true })
  descripcion: string | null;

  @Column({ name: 'esta_activo', default: true })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => PrEmpleadoRol, (empleadoRol) => empleadoRol.rol)
  empleados: PrEmpleadoRol[];
}
