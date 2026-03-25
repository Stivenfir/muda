import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrEmpleado } from './pr-empleado.entity';
import { PrRol } from './pr-rol.entity';

@Entity('pr_empleado_rol')
export class PrEmpleadoRol {
  @PrimaryGeneratedColumn({ name: 'empleado_rol_id' })
  empleadoRolId: number;

  @Column({ name: 'empleado_id' })
  empleadoId: number;

  @Column({ name: 'rol_id' })
  rolId: number;

  @Column({ name: 'esta_activo', default: true })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @ManyToOne(() => PrEmpleado, (empleado) => empleado.roles)
  @JoinColumn({ name: 'empleado_id' })
  empleado: PrEmpleado;

  @ManyToOne(() => PrRol, (rol) => rol.empleados)
  @JoinColumn({ name: 'rol_id' })
  rol: PrRol;
}
