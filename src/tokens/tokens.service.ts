import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CrearTransaccionDto } from '../transacciones/dto/crear-transaccion.dto';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async comprarTokens(dto: CrearTransaccionDto): Promise<{ mensaje: string; balanceActual: number }> {
    console.log('DTO recibido:', dto); // Log para verificar datos
  
    const usuario = await this.usuarioRepository.findOneBy({ id: dto.usuarioId });
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado.');
    }
  
    if (dto.cantidad <= 0) {
      throw new BadRequestException('La cantidad de tokens debe ser mayor a cero.');
    }
  
    // Actualizar el balance del usuario
    usuario.balanceTokens += dto.cantidad;
    await this.usuarioRepository.save(usuario);
  
    // Registrar la transacción
    const nuevosTokens = this.tokenRepository.create({
      cantidad: dto.cantidad,
      usuario,
    });
    await this.tokenRepository.save(nuevosTokens);
  
    console.log(`Compra exitosa: ${dto.cantidad} tokens agregados al usuario ${usuario.id}`);
    return { mensaje: `Compra exitosa: ${dto.cantidad} tokens agregados.`, balanceActual: usuario.balanceTokens };
  }
}  