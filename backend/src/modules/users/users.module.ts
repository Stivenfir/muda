import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrEmpleado } from '../rrhh/entities/pr-empleado.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([PrEmpleado])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
