import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth') // Base del endpoint
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // Decorador para permitir acceso sin autenticación
  @Post('login') // Endpoint específico para login
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    console.log(loginDto)
    const { token, user } = await this.authService.login(loginDto);
    return { token };
  }
}
