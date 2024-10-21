import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  telefono: string;

  @Column({ nullable: true })
  empresa: string;

  @Column()
  ciudad: string;

  @Column({ nullable: true })
  imagenUrl: string; // Almacenar URL de la imagen

  @Column({ nullable: true })
  servicioOfrecido: string;  // Añadimos el campo servicio ofrecido

  @Column({ nullable: true })
  servicioRequerido: string;  // Añadimos el campo servicio requerido
}

