import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuariosService: UsuariosService, // Usar forwardRef para la inyección de dependencias
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, contrasena } = loginDto;

    // Validar credenciales usando UsuariosService
    const usuario = await this.usuariosService.validarCredenciales(
      email,
      contrasena,
    );

    // Generar el token JWT
    const payload = { sub: usuario.id, email: usuario.email };
    const token = this.jwtService.sign(payload);

    return { token, user: usuario };
  }
}
