import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrEmpleado } from '../rrhh/entities/pr-empleado.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(PrEmpleado)
    private readonly empleadosRepository: Repository<PrEmpleado>,
  ) {}

  async findByUsername(username: string) {
    const empleado = await this.empleadosRepository.findOne({
      where: {
        nombreUsuario: username,
        estaActivo: true,
        estadoEmpleado: 'ACTIVO',
      },
      relations: this.getBaseRelations(),
    });

    return this.mapEmpleado(empleado);
  }

  async findById(empleadoId: number) {
    const empleado = await this.empleadosRepository.findOne({
      where: {
        empleadoId,
        estaActivo: true,
        estadoEmpleado: 'ACTIVO',
      },
      relations: this.getBaseRelations(),
    });

    return this.mapEmpleado(empleado);
  }

  private getBaseRelations() {
    return {
      roles: {
        rol: {
          permisos: {
            permiso: true,
          },
        },
      },
    };
  }

  private mapEmpleado(empleado: PrEmpleado | null) {
    if (!empleado) {
      return null;
    }

    const roles = (empleado.roles ?? [])
      .filter((rolAsignado) => rolAsignado.estaActivo && rolAsignado.rol?.estaActivo)
      .map((rolAsignado) => rolAsignado.rol.codigoRol);

    const permissions = (empleado.roles ?? []).flatMap((rolAsignado) =>
      (rolAsignado.rol?.permisos ?? [])
        .filter((permisoAsignado) => permisoAsignado.estaActivo && permisoAsignado.permiso?.estaActivo)
        .map((permisoAsignado) => permisoAsignado.permiso.codigoPermiso),
    );

    return {
      id: empleado.empleadoId,
      username: empleado.nombreUsuario,
      password: empleado.contrasenaHash,
      role: roles[0] || 'SIN_ROL',
      roles,
      permissions: Array.from(new Set(permissions)),
      isActive: empleado.estaActivo,
    };
  }
}
