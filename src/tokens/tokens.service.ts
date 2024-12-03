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

  async comprarTokens(dto: CrearTransaccionDto): Promise<Token> {
    const usuario = await this.usuarioRepository.findOneBy({id:dto.usuarioId});
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const nuevosTokens = this.tokenRepository.create({
      cantidad: dto.cantidad,
      usuario,
    });

    await this.tokenRepository.save(nuevosTokens);
    return nuevosTokens;
  }
}
