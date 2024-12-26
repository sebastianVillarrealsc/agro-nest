import { IsString, IsNumber, IsNotEmpty, Min, MaxLength } from 'class-validator';

export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @MaxLength(500)
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsNumber()
  @Min(0)
  cantidad: number;

  @IsString()
  @IsNotEmpty()
  proveedorId: string;
}
