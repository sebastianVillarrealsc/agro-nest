import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity'; // Entidad Usuario
import { AuthService } from './auth.service'; // Servicio de autenticación
import { JwtStrategy } from './jwt.strategy'; // Estrategia JWT
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Guard para proteger rutas
import { JwtModule } from '@nestjs/jwt'; // Módulo JWT
import { PassportModule } from '@nestjs/passport'; // Módulo Passport
import { UsuariosModule } from '../usuarios/usuarios.module'; // Módulo Usuarios

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]), // Registrar entidad Usuario
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configurar Passport con JWT
    JwtModule.register({
      secret: 'mi_secreto', // Cambiar en producción
      signOptions: { expiresIn: '1h' }, // Configuración de expiración del token
    }),
    forwardRef(() => UsuariosModule), // Usar forwardRef para romper la dependencia circular
  ],
  providers: [
    AuthService, // Servicio de autenticación
    JwtStrategy, // Estrategia JWT
    JwtAuthGuard, // Guard para proteger rutas con JWT
  ],
  exports: [
    AuthService, // Exportar servicio para uso externo
    JwtModule , // Exportar módulo JWT
  ],
})
export class AuthModule {}
