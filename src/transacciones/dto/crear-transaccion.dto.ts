import { IsUUID, IsInt, IsPositive, IsOptional } from 'class-validator';

export class CrearTransaccionDto {
  @IsUUID()
  usuarioId: string;

  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsOptional()
  @IsPositive()
  monto?: number; // Monto pagado (opcional)
}
