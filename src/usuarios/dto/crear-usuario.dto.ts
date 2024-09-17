import { IsString, IsNumber, IsEmail, IsUUID } from 'class-validator';

export class CrearUsuarioDto {
  @IsUUID()
  id: string;

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsNumber()
  cui: number;

  @IsString()
  empresa: string;

  @IsNumber()
  telefono: number;

  @IsEmail()
  email: string;

  @IsString()
  direccion: string;

  @IsString()
  ciudad: string;

  @IsString()
  pais: string;

  @IsString()
  servicioOfrecido: string;

  @IsString()
  servicioRequerido: string;

  @IsString()
  capacidadOperativa: string;
}
