import { Controller, Post, Body } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CrearTransaccionDto } from '../transacciones/dto/crear-transaccion.dto';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('comprar')
  async comprarTokens(@Body() dto: CrearTransaccionDto) {
    return this.tokensService.comprarTokens(dto);
  }
}
