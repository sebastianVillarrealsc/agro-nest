import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransaccionesService } from './transacciones.service';
import { CrearTransaccionDto } from './dto/crear-transaccion.dto';

@Controller('transacciones')
export class TransaccionesController {
  constructor(private readonly transaccionesService: TransaccionesService) {}

  @Post()
  async registrarTransaccion(@Body() dto: CrearTransaccionDto) {
    return this.transaccionesService.registrarTransaccion(dto);
  }

  @Get(':usuarioId')
  async obtenerTransaccionesPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.transaccionesService.obtenerTransaccionesPorUsuario(usuarioId);
  }
}
