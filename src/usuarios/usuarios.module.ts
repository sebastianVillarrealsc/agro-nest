import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity'; // Entidad Usuario
import { UsuariosService } from './usuarios.service'; // Servicio de usuarios
import { UsuariosController } from './usuarios.controller'; // Controlador de usuarios
import { AuthModule } from '../auth/auth.module'; // Módulo de autenticación

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]), // Registrar entidad Usuario
    forwardRef(() => AuthModule), // Usar forwardRef para romper la dependencia circular
  ],
  providers: [
    UsuariosService, // Servicio de lógica de negocio para usuarios
  ],
  controllers: [
    UsuariosController, // Controlador para rutas relacionadas con usuarios
  ],
  exports: [
    UsuariosService, // Exportar el servicio de usuarios si otros módulos lo necesitan
  ],
})
export class UsuariosModule {}
