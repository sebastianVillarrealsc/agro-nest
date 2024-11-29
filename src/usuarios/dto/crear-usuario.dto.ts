import {
  IsString,
  IsNumber,
  IsEmail,
  IsUUID,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';

// Definimos un Enum para los roles permitidos
export enum RolesPermitidos {
  Publicidad = 'Publicidad',
  ProveedorInsumos = 'Proveedor de Insumos',
  ProveedorServicios = 'Proveedor de Servicios',
  Mecenas = 'Mecenas',
}

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
  servicioOfrecido: string;

  @IsString()
  servicioRequerido: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;

  // Campo para el rol del usuario, validado con el Enum
  @IsEnum(RolesPermitidos, { message: 'El rol debe ser uno de los valores permitidos.' })
  rol: RolesPermitidos;

  // Campo de contraseña con validación de longitud mínima
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;
}
