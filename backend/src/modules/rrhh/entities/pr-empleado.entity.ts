import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrPersona } from './pr-persona.entity';
import { PrEmpleadoRol } from './pr-empleado-rol.entity';

@Entity('pr_empleado')
export class PrEmpleado {
  @PrimaryGeneratedColumn({ name: 'empleado_id' })
  empleadoId: number;

  @Column({ name: 'persona_id', unique: true })
  personaId: number;

  @Column({ name: 'codigo_empleado', length: 30, unique: true })
  codigoEmpleado: string;

  @Column({ name: 'cargo', length: 100 })
  cargo: string;

  @Column({ name: 'area', length: 100 })
  area: string;

  @Column({ name: 'nombre_usuario', length: 80, unique: true })
  nombreUsuario: string;

  @Column({ name: 'contrasena_hash', length: 255 })
  contrasenaHash: string;

  @Column({ name: 'esta_activo', default: true })
  estaActivo: boolean;

  @Column({ name: 'estado_empleado', length: 20, default: 'ACTIVO' })
  estadoEmpleado: string;

  @Column({ name: 'fecha_ingreso', type: 'date', nullable: true })
  fechaIngreso: Date | null;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToOne(() => PrPersona, (persona) => persona.empleado)
  @JoinColumn({ name: 'persona_id' })
  persona: PrPersona;

  @OneToMany(() => PrEmpleadoRol, (empleadoRol) => empleadoRol.empleado)
  roles: PrEmpleadoRol[];
}
