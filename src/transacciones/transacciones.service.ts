import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaccion } from './entities/transaccion.entity';
import { CrearTransaccionDto } from './dto/crear-transaccion.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class TransaccionesService {
  constructor(
    @InjectRepository(Transaccion)
    private readonly transaccionRepository: Repository<Transaccion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async registrarTransaccion(dto: CrearTransaccionDto): Promise<Transaccion> {
    const usuario = await this.usuarioRepository.findOneBy({id:dto.usuarioId});
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const nuevaTransaccion = this.transaccionRepository.create({
      ...dto,
      usuario,
      tipo: dto.cantidad > 0 ? 'compra' : 'venta',
    });

    await this.transaccionRepository.save(nuevaTransaccion);

    usuario.balanceTokens += dto.cantidad;
    await this.usuarioRepository.save(usuario);

    return nuevaTransaccion;
  }

  async obtenerTransaccionesPorUsuario(usuarioId: string): Promise<Transaccion[]> {
    const transacciones = await this.transaccionRepository.find({
      where: { usuario: { id: usuarioId } },
    });

    if (!transacciones.length) {
      throw new NotFoundException('No se encontraron transacciones para este usuario.');
    }

    return transacciones;
  }
}
