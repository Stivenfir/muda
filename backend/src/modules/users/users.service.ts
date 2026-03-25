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
      relations: {
        roles: {
          rol: true,
        },
      },
    });

    if (!empleado) {
      return null;
    }

    const rolPrincipal = empleado.roles?.[0]?.rol?.codigoRol || 'SIN_ROL';

    return {
      id: empleado.empleadoId,
      username: empleado.nombreUsuario,
      password: empleado.contrasenaHash,
      role: rolPrincipal,
      isActive: empleado.estaActivo,
    };
  }
}
