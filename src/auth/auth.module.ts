import { AuthController } from './auth.controller';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity'; // Entidad Usuario
import { AuthService } from './auth.service'; // Servicio de autenticación
import { JwtStrategy } from './jwt.strategy'; // Estrategia JWT
// import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Guard para proteger rutas
import { JwtModule } from '@nestjs/jwt'; // Módulo JWT
import { PassportModule } from '@nestjs/passport'; // Módulo Passport
import { UsuariosModule } from '../usuarios/usuarios.module'; // Módulo Usuarios
import { JwtAuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),//configuracion del modulo
    TypeOrmModule.forFeature([Usuario]), // Registrar entidad Usuario
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configurar Passport con JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Cambiar en producción
      signOptions: { expiresIn: '1d' }, // Configuración de expiración del token
    }),
    forwardRef(() => UsuariosModule), // Usar forwardRef para romper la dependencia circular
  ],
  providers: [
    AuthService, // Servicio de autenticación
    // JwtStrategy, // Estrategia JWT
    JwtAuthGuard, // Guard para proteger rutas con JWT
  ],
  controllers: [
    AuthController,
  ],
  exports: [
    AuthService, // Exportar servicio para uso externo
    JwtModule , // Exportar módulo JWT
  ],
})
export class AuthModule {}
