import { Controller, Post, Body, Get, Param, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { TransaccionesService } from './transacciones.service';
import { CrearTransaccionDto } from './dto/crear-transaccion.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('transacciones')
@UseGuards(JwtAuthGuard)
export class TransaccionesController {
  constructor(private readonly transaccionesService: TransaccionesService) {}

  @Post()
  async registrarTransaccion(@Body() dto: CrearTransaccionDto, @Request() req) {
    const usuarioId = req.user.sub;

    if (usuarioId !== dto.usuarioId) {
      throw new BadRequestException('El usuario de la transacción no coincide con el usuario autenticado.');
    }
    dto.usuarioId = usuarioId;
    return this.transaccionesService.registrarTransaccion(dto);
  }

  @Get()
  async obtenerTransaccionesPorUsuario(@Request() req) {
    const usuarioId = req.user.sub;
    return this.transaccionesService.obtenerTransaccionesPorUsuario(usuarioId);
  }
}
