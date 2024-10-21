import { IsString, IsNumber, IsEmail, IsUUID, IsOptional } from 'class-validator';

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

  @IsString()
  telefono: string;

  @IsEmail()
  email: string;

  @IsString()
  direccion: string;

  @IsString()
  ciudad: string;

  @IsString()
  pais: string;

  @IsString()
  servicioOfrecido: string;  // Añadimos este campo

  @IsString()
  servicioRequerido: string;  // Añadimos este campo

  @IsOptional() 
  @IsString()
  imagenUrl?: string;
}

