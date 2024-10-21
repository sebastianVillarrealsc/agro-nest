import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity'; // Importar la entidad
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])], // Registrar la entidad en el módulo
  providers: [UsuariosService],
  controllers: [UsuariosController],
})
export class UsuariosModule {}
