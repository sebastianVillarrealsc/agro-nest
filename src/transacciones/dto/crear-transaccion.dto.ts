import { IsUUID, IsInt, IsPositive, IsDecimal } from 'class-validator';

export class CrearTransaccionDto {
  @IsUUID()
  usuarioId: string;

  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsDecimal()
  monto: number; // Monto pagado
}
