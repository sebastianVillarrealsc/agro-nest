import { PartialType } from '@nestjs/mapped-types';
import { CrearUsuarioDto, RolesPermitidos } from './crear-usuario.dto';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class ModificarUsuarioDto extends PartialType(CrearUsuarioDto) {
  // Validamos el rol cuando se modifique
  @IsOptional()
  @IsEnum(RolesPermitidos, { message: 'El rol debe ser uno de los valores permitidos.' })
  rol?: RolesPermitidos;

  // Campo de contraseña con validación opcional y longitud mínima
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena?: string;
}
