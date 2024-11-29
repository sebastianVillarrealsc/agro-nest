import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Enum para roles permitidos
export enum RolesPermitidos {
  Publicidad = 'Publicidad',
  ProveedorInsumos = 'Proveedor de Insumos',
  ProveedorServicios = 'Proveedor de Servicios',
  Mecenas = 'Mecenas',
}

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 15, nullable: true })
  telefono: string;

  @Column({ length: 100, nullable: true })
  empresa: string;

  @Column({ length: 50 })
  ciudad: string;

  @Column({ nullable: true })
  imagenUrl: string; // Almacenar URL de la imagen

  @Column({ nullable: true })
  servicioOfrecido: string; // Campo servicio ofrecido

  @Column({ nullable: true })
  servicioRequerido: string; // Campo servicio requerido

  @Column({
    type: 'enum',
    enum: RolesPermitidos,
    default: RolesPermitidos.ProveedorInsumos,
  })
  rol: RolesPermitidos; // Enum para definir el rol del usuario

  @Column({ type: 'float', default: 0 })
  balanceTokens: number; // Balance inicializado en 0

  @Column({ type: 'varchar', length: 255 })
  contrasena: string; // Campo para la contraseña
}
